<template>
  <!-- 资讯列表页面 -->
  <div class="article">
    <!-- {{this.articleData}} -->
    <!-- 头部 -->
    <div class="header">
      <!-- 状态下拉框 -->
      <el-select v-model="articleStatus" clearable placeholder="请选择状态">
        <el-option label="未审核" value="未审核" />
        <el-option label="审核通过" value="审核通过" />
        <el-option label="审核不通过" value="审核不通过" />
        <el-option label="推荐" value="推荐" />
      </el-select>
      <!-- 标题输入框 -->

      <el-input v-model="articleTitle" placeholder="标题" clearable style="width: 200px" />

      <!-- 栏目下拉框 -->
      <el-select v-model="articleValue" clearable placeholder="请选择栏目">
        <el-option
          v-for="category in categoryArr.filter((item) => !item.parentId)"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
      <el-button v-buttonThrotFromMx="queryArticle" type="primary">查询</el-button>
      <el-button type="primary" style="float:right" @click="upArticle">发布风采</el-button>
    </div>
    <!-- 身体 -->
    <!-- 表格内容展示区 -->
    <div class="table_content">
      <!-- :data 整个表格的数据源 -->
      <el-table :data="articleData" style="width: 100%" @row-dblclick="detailOpen">
        <!-- 序号 -->
        <el-table-column type="index" label="序号" align="center" />
        <!-- 序号 -->
        <!-- <el-table-column type="id" label="编号" align="center" prop="id" /> -->
        <!-- 封面 -->
        <el-table-column label="封面" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-image
              style="width: 120px; height: 120px"
              :src="scope.row.cover"
              :preview-src-list="[scope.row.cover]"
            />
          </template>
        </el-table-column>
        <!-- 风采 -->
        <el-table-column label="风采" width="500">
          <template slot-scope="scope">
            <!-- 标题 -->
            <h3>标题：{{ scope.row.title }}</h3>
            <p v-if="!scope.row.category.name">栏目类别：---</p>
            <p v-else>栏目类别：{{ scope.row.category.name }}</p>

            <p>出版时间：{{ scope.row.publishTime | fmtDate1 }}</p>
            <p v-if="!scope.row.baseUser">---</p>
            <p v-else>{{ scope.row.baseUser.realname }}</p>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <!-- 标题 -->
            <el-tag v-if="scope.row.status == '未审核'" type="danger" color="white">{{ "未审核" }}</el-tag>
            <el-tag v-else-if="scope.row.status == '审核通过'" type="success" color="white">{{ "审核通过" }}</el-tag>
            <el-tag v-else-if="scope.row.status == '推荐'" type="warning" color="white">{{ "推荐" }}</el-tag>
            <el-tag v-else type="info" color="white">{{ "审核不通过" }}</el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="color:orange" @click="editUser(scope.row)">编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="color:green"
              @click="getChangeStatus(scope.row.id,scope.row.status)"
            >推荐</el-button>
            <el-button
              style="color:blue"
              type="text"
              size="small"
              @click="handOpen(scope.row.id,scope.row.status)"
            >审核</el-button>
            <el-button
              style="color:red"
              type="text"
              size="small"
              @click="clickDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 尾部 -->
    <div class="paginetion">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 审核模态框 -->
    <el-dialog title="审核风采信息" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <div class="dialog_header">
        <h3 style="padding-left:45%;padding-bottom:20px ">{{ this.shtitle }}</h3>
        <p v-html="this.content" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="Shbtg">审核不通过</el-button>
        <el-button type="success" @click="Shtg">审核通过</el-button>
      </span>
    </el-dialog>
    <!-- 编辑模态框 -->
    <el-dialog title="编辑风采信息" :visible.sync="dialogVisible2" @close="dialogClose">
      <el-form
        ref="rule_Form"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题：" prop="title">
          <el-input v-model="ruleForm.title" />
        </el-form-item>
        <el-form-item label="分类：" prop="categoryId">
          <el-select v-model="ruleForm.categoryId" clearable placeholder="请选择栏目">
            <el-option
              v-for="category in categoryArr.filter((item) => !item.parentId)"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="ruleForm.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <p style="color:grey">上传头像图片大小不能超过 3MB!</p>
        </el-form-item>
        <!-- 富文本编辑框 -->
        <el-form-item label="正文:">
          <tinymce v-model="ruleForm.content" :height="240" />
        </el-form-item>
      </el-form>

      <!-- 底部操作按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2=false">取 消</el-button>
        <!-- 提交表单后，调用重置表单的方法 -->
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入axios
import { get, post } from '@/utils/request'
// 引入文件上传路径 和 文件预览的路径
import { showFileURL, uploadFileURL } from '@/utils/config'
// 引入富文本Tinymce
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      // 真实姓名
      realname: '',
      // 图片预览的路径
      imageUrl: '',
      // 上传的服务器地址
      uploadFileURL,
      // 标题
      articleTitle: '',
      // 状态下拉框
      articleStatus: '',
      // 栏目下拉框
      articleValue: '',
      // 编号
      id: '',
      // 主题
      title: '',
      // 审核主题
      shtitle: '',
      // 审核内容
      content: '',
      // 状态
      status: '',
      // 审核状态
      shstatus: '',
      // 栏目数组
      categoryArr: [],
      // 查询的参数
      queryData: {},

      // 用户数组 - 表格的数据源的数据
      articleData: [],
      // 封面
      cover: '',
      // 用户状态
      userStatus: '',
      // 当前的页码
      currentPage: 1,
      // 每页要展示的数据条数
      pageSize: 8,
      // 页面展示数据的总条数
      total: 10,
      // 模态框
      dialogVisible: false,
      dialogVisible2: false,
      // 表单验证
      ruleForm: {
        // 标题
        title: '',
        // 分类
        categoryId: '',
        // 封皮
        cover: '',
        // 富文本编辑器
        content: ''
      },
      rules: {
        // 标题
        title: [
          { required: true, message: '请输入标题名称：', trigger: 'blur' }
        ],
        // 分类：
        categoryId: [
          { required: true, message: '请选择分类：', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请选择分类：', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.getAllUserData()
    this.getCategory()
    // this.getChangeStatus();
  },
  mounted() {},
  methods: {
    // 发布表单
    submitForm() {
      this.$refs['rule_Form'].validate(async(valid) => {
        if (valid) {
          // 发生表单验证的请求 提交表单对象
          const res = await post('/article/saveOrUpdate', this.ruleForm)
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else {
            this.$message.error(res.message)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传文件成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.ruleForm.cover = showFileURL + res.data.id
    },
    // 上传文件
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
      return isLt2M
    },
    // 关闭模态框  调用表单重置的方法
    dialogClose() {
      // 重置表单
      this.$refs['User_form'].resetFields()
      // 关闭模态框
      this.dialogVisible2 = false
    },
    // 编辑信息
    editUser(row) {
      // 深拷贝
      this.ruleForm = { ...row }
      console.log(this.ruleForm.cover)
      // /让模态框显示出来
      this.dialogVisible2 = true
    },
    // 删除信息
    clickDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      const res = get('/article/deleteById', { id })
      // 给用户一个成功或失败的提示
      if (res.status === 200) {
        this.$message({
          message: res.message,
          type: 'success'
        })
      } else {
        this.$message.error(res.message)
      }
      // 重新刷新页面
      this.getAllUserData()
    },
    // 跳转到详情信息页面
    detailOpen(row) {
      this.$router.push({
        path: '/admin/info/article/Details',
        query: {
          id: row.id
        }
      })
      // console.log(row.id);
    },
    // 发布风采
    upArticle() {
      this.$router.push({
        path: '/admin/info/article/Publish'
      })
    },
    // 审核通过
    Shtg() {
      this.shstatus = '审核通过'
      this.getChangeStatus2(this.id, this.shstatus)
      this.dialogVisible = false
    },
    // 审核不通过
    Shbtg() {
      this.shstatus = '审核不通过'
      this.getChangeStatus2(this.id, this.shstatus)
      this.dialogVisible = false
    },
    // 打开模态框
    async handOpen(id, status) {
      this.dialogVisible = true
      this.id = id
      const res = await get('/article/findById', { id })
      this.shtitle = res.data.title
      this.content = res.data.content
      console.log(res)
    },
    // 关闭模态框
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    handleSizeChange(val) {
      // 将每页要展示的数据的条数
      this.pageSize = val
      this.currentPage = 1
      this.getAllUserData()
    },
    handleCurrentChange(val) {
      // 将当前页数 与分页插件动态点击控制的页数绑定
      this.currentPage = val
      // 重新调用获取所以产品数据的方法
      this.getAllUserData()
    },
    // 模糊查询
    queryArticle() {
      const data = {
        // 栏目
        categoryId: this.articleValue,
        // 状态
        status: this.articleStatus,
        // 标题
        title: this.articleTitle
      }
      // 格式化参数 当某个参数没有值的时候 将其删除
      for (const key in data) {
        if (!data[key]) {
          delete data[key]
        }
      }
      this.queryData = data
      this.currentPage = 1
      this.getAllUserData()
    },
    // 修改风采状态
    async getChangeStatus(id, status) {
      status = '推荐'
      const res = await post('/article/changeStatus', { id, status })
      this.getAllUserData()
      console.log(res)
    },
    // 审核风采状态
    async getChangeStatus2(id, status) {
      status = this.shstatus
      const res = await post('/article/changeStatus', { id, status })
      console.log(res)
      this.getAllUserData()
    },
    // 遍历所有栏目
    async getCategory() {
      const res = await get('/category/findAll')
      this.categoryArr = res.data
      // console.log(res.data);
    },
    // 分页获取全部学生风采信息
    async getAllUserData() {
      // 获取参数
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await get('/article/pageQuery', {
        ...data,
        ...this.queryData
      })
      this.articleData = res.data.list

      // 获取全部
      this.total = res.data.total
      console.log(res.data.list)
    }
  }
}
</script>
<style >
* {
  margin: 0;
  padding: 0;
}
.dialog_header {
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(9, 98, 139);
}

.article {
  margin-bottom: 40px;
}
/* 分页区域的样式 */
.paginetion {
  position: fixed;
  bottom: 10px;
  right: 30px;
}
</style>
