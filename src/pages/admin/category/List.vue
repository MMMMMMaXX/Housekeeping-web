<template>
  <!-- 产品栏目管理 -->
  <div id="category">
    <!-- 头部区域 -->
    <div class="header">
      <el-button type="primary" @click="addCategory">添加</el-button>
    </div>
    <!-- 表格内容展示区域 -->
    <div class="table_content">
      <el-table :data="categoryData" style="width: 100%">
        <!-- 序号 -->
        <el-table-column type="index" label="序号" align="center" />
        <!-- 栏目编号 -->
        <el-table-column prop="id" label="栏目编号" align="center" />
        <!-- 名称 -->
        <el-table-column prop="name" label="名称" align="center" />
        <!-- 图标 -->
        <el-table-column label="图标" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-image style="width: 40px; height: 40px" :src="scope.row.icon" :preview-src-list="[scope.row.icon]" />
          </template>
        </el-table-column>
        <!-- 排序号 -->
        <el-table-column prop="num" label="排序号" align="center" />
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" size="small" @click="editCategory(scope.row)">编辑</el-link>
            <el-link type="danger" size="small" @click="deleteCategory(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部分页区域 -->
    <div class="paginetion">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 表单模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
      <el-form ref="category_form" :model="categoryForm" :rules="rules" label-width="80px">
        <!-- 栏目名称 -->
        <el-form-item label="栏目名称" prop="name">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <!-- 序号 -->
        <el-form-item label="序号" type="num">
          <el-input v-model="categoryForm.num" />
        </el-form-item>
        <!-- 图标 -->
        <el-form-item label="图标" prop="icon">
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="imageUrl" :src="categoryForm.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部操作按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后 调用重置表单的方法 -->
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入axios
import {
  get,
  post
} from '@/utils/request'
  // 引入vuex辅助函数
  // import { mapActions, mapState } from "vuex"
  // 引入文件上传路径 和 文件预览的路径
import {
  showFileURL,
  uploadFileURL
} from '@/utils/config'
export default {
  data() {
    return {
      // 上传文件的服务器地址
      uploadFileURL,
      // 产品栏目数组
      categoryData: [],
      // 控制模态框的显示与隐藏
      dialogVisible: false,
      // 模态框的标题
      dialogTitle: '新增产品栏目',
      // 表单对象
      categoryForm: {
        // 名称
        name: '',
        // 序号
        num: '',
        // 图标
        icon: ''
      },
      // 表单验证
      rules: {
        // 产品名称
        name: [{
          required: true,
          message: '请输入产品栏目名称',
          trigger: 'blur'
        }],
        // 图标
        icon: [{
          required: true,
          message: '请选择合适的图标',
          trigger: 'change'
        }]
      },
      // 当前页码
      currentPage: 1,
      // 每页要展示的数据条数
      pageSize: 8,
      // 页面展示数据的总条数
      total: 10,
      // 图片预览的路径
      imageUrl: ''
    }
  },
  computed: {
    // 获取账户数据
    // ...mapState('category', ['categoryData']),
  },
  created() {
    // 自动的获取产品栏目数据
    this.queryCategoryData()
  },
  mounted() {},
  methods: {
    // 上传之前
    beforeUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
      }
    },
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // 上传成功之后 更新categoryForm.url的路径
      this.categoryForm.icon = showFileURL + res.data.id
    },
    // 添加产品栏目
    addCategory() {
      // 清空表单对象
      this.categoryForm = {}
      // 将imageUrl 置空
      this.imageUrl = ''
      // 设置模态框的标题
      this.dialogTitle = '新增产品栏目'
      // 模态框显示出来
      this.dialogVisible = true
    },
    // 关闭模态框 调用表单重置的方法
    dialogClose() {
      // 清空表单对象
      this.categoryForm = {}
      // 将imageUrl 置空
      this.imageUrl = ''
      // 重置表单
      this.$refs['category_form'].resetFields()
      // 关闭模态框
      setTimeout(() => {
        this.dialogVisible = false
      }, 200)
    },
    // 表单提交  新增或编辑产品栏目信息
    submitForm() {
      this.$refs['category_form'].validate(async(valid) => {
        if (valid) {
          // 发送表单验证的请求 提交表单对象
          const res = await post('/productCategory/saveOrUpdate', this.categoryForm)
          // 给用户一个成功的提示
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            // 重新刷新页面的数据
            this.getAllCategoryData()
            // 调用关闭模态框的方法
            this.dialogClose()
          } else {
            this.$message.error(res.message)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑产品栏目信息
    editCategory(row) {
      // 清空表单对象
      this.categoryForm = {}
      // 将imageUrl 置空
      this.imageUrl = ''
      // 将当前点击的这一行的对象 赋值到 表单对象里
      this.categoryForm = {
        ...row
      }
      // 预览图片 地址赋值
      this.imageUrl = this.categoryForm.icon
      // 设置模态框的标题
      this.dialogTitle = '编辑产品栏目'
      // 模态框显示出来
      this.dialogVisible = true
    },
    // 根据id删除产品栏目信息
    deleteCategory(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await get('/productCategory/deleteById', {
          id
        })
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新刷新页面数据
          this.getAllCategoryData()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 引入获取产品栏目数据的方法
    // ...mapActions('category', ['getAllCategoryData']),
    async getAllCategoryData() {
      // 获取参数
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await get('/productCategory/pageQuery', {
        ...data,
        ...this.queryData
      })
      // 将data中的产品数组 进行赋值
      this.categoryData = res.data.list
      // 页面总数据条数 赋值
      this.total = res.data.total
    },
    // 获取产品栏目数据
    queryCategoryData() {
      const data = {
        page: 1,
        pageSize: 100
      }
      // 调用获取产品栏目数据的方法
      this.getAllCategoryData(data)
    },
    handleSizeChange(val) {
      // 将每页要展示的数据的条数 进行一个更新
      this.pageSize = val
      // 将当前的页数 重置到第一页
      this.currentPage = 1
      // 重新调用获取产品栏目数据的方法
      this.getAllCategoryData()
    },
    handleCurrentChange(val) {
      // 将当前页数 与 分页插件动态点击控制的页数相绑定
      this.currentPage = val
      // 重新调用获取产品栏目数据的方法
      this.getAllCategoryData()
    }
  }
}

</script>
<style scoped>
  .paginetion {
    position: fixed;
    bottom: 40px;
    right: 10px;
  }

</style>
