<template>
  <!-- 轮播配置页面 -->
  <div class="carousel">
    <!-- 头部内容 -->
    <div class="header">
      <!-- 新增按钮 -->
      <el-button type="primary" @click="addCarousel">新增</el-button>
      <!-- 预览按钮 -->
      <el-button type="primary" @click="lookCarouselUrl">预览</el-button>
    </div>
    <!-- 表格内容展示区 -->
    <div class="table_content">
      <el-table :data="carouselData" style="width: 100%">
        <!-- 序号 -->
        <el-table-column type="index" label="序号" align="center" />
        <!-- 轮播图名称 -->
        <el-table-column prop="name" label="轮播图名称" align="center" />
        <!-- 轮播图描述 -->
        <el-table-column prop="introduce" label="轮播图描述" align="center" />
        <!-- 轮播图图片 -->
        <el-table-column prop="url" label="轮播图图片" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 30px" :src="scope.row.url" :preview-src-list="[scope.row.url]" />
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '正常'" type="success" plain size="small">正常</el-tag>
            <el-tag v-else type="danger" plain size="small">停用</el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="success" size="small" @click="editCarousel(scope.row)">编辑</el-link>
            <el-link type="danger" size="small" @click="deleteCarousel(scope.row.id)">删除
            </el-link>
            <el-link v-if="scope.row.status == '正常'" type="primary" size="small" @click="clickOff(scope.row)">停用
            </el-link>
            <el-link v-else type="primary" size="small" @click="clickStart(scope.row)">启用</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部分页区域 -->
    <div class="paginetion" />
    <!-- 表单模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
      <el-form ref="carousel_form" :model="carouselForm" :rules="rules" label-width="80px">
        <!-- 名称 -->
        <el-form-item label="名称" prop="name">
          <el-input v-model="carouselForm.name" />
        </el-form-item>
        <!-- 轮播图片 -->
        <el-form-item label="图片" prop="url">
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="imageUrl" :src="carouselForm.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item label="描述" prop="introduce">
          <el-input v-model="carouselForm.introduce" type="textarea" />
        </el-form-item>
      </el-form>
      <!-- 底部操作按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后 调用重置表单的方法 -->
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 预览大图模态框 -->
    <el-dialog title="大屏预览" :visible.sync="dialogUrlVisible" @click="dialogUrlClose">
      <el-carousel v-if="NormalUrl" class="carousel_style">
        <el-carousel-item v-for="(item,index) of NormalUrl" :key="index">
          <img :src="item.url" style="width:100%">
        </el-carousel-item>
      </el-carousel>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogUrlClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入axios
import {
  get,
  post
} from '@/utils/request'
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
      // 轮播图数组 - 表格的数据源的数据
      carouselData: [],
      // 控制模态框的显示与隐藏
      dialogVisible: false,
      // 模态框的标题
      dialogTitle: '新增轮播图',
      // 表单对象
      carouselForm: {
        // 名称
        name: '',
        // 轮播图片
        url: '',
        // 描述
        introduce: ''
      },
      // 表单验证
      rules: {
        // 产品名称
        name: [{
          required: true,
          message: '请输入轮播图名称',
          trigger: 'blur'
        }],
        // 图片
        url: [{
          required: true,
          message: '请选择图片',
          trigger: 'change'
        }]
      },
      // 图片预览的路径
      imageUrl: '',
      // 大屏预览模态框
      dialogUrlVisible: false
    }
  },
  computed: {
    // 获取到状态为正常的图片预览显示
    NormalUrl: function() {
      return this.carouselData.filter(function(i) {
        return i.status === '正常'
      })
    }
  },
  created() {
    // 自动的获取轮播图数据
    this.getAllCarouselData()
  },
  mounted() {},
  methods: {
    async getAllCarouselData() {
      // 发送网络请求 获取轮播图数组数据
      const res = await get('/carousel/query')
      // console.log(res);
      // 将data中的轮播图数组 进行赋值
      this.carouselData = res.data
    },
    // 上传之前
    beforeUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
      }
    },
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // 上传成功之后 更新carouselForm.url的路径
      this.carouselForm.url = showFileURL + res.data.id
    },
    // 新增轮播图
    addCarousel() {
      // 清空表单对象
      this.carouselForm = {}
      // 将imageUrl 置空
      this.imageUrl = ''
      // 设置模态框的标题
      this.dialogTitle = '新增轮播图'
      // 模态框显示出来
      this.dialogVisible = true
    },
    // 关闭模态框 调用表单重置的方法
    dialogClose() {
      // 清空表单对象
      this.carouselForm = {}
      // 将imageUrl 置空
      this.imageUrl = ''
      // 重置表单
      this.$refs['carousel_form'].resetFields()
      // 关闭模态框
      setTimeout(() => {
        this.dialogVisible = false
      }, 200)
    },
    // 编辑轮播图
    editCarousel(row) {
      console.log(row)
      // 清空表单对象
      this.carouselForm = {}
      // 将imageUrl 置空
      this.imageUrl = ''
      // 将当前点击的这一行的对象 赋值到 表单对象里
      this.carouselForm = {
        ...row
      }
      // 预览图片 地址赋值
      this.imageUrl = this.carouselForm.url
      // 设置模态框的标题
      this.dialogTitle = '编辑轮播图'
      // 模态框显示出来
      this.dialogVisible = true
    },
    // 表单提交  新增或编辑轮播图信息
    submitForm() {
      this.$refs['carousel_form'].validate(async(valid) => {
        if (valid) {
          // 发送表单验证的请求 提交表单对象
          const res = await post('/carousel/saveOrUpdate', this.carouselForm)
          // 给用户一个成功的提示
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            // 重新刷新页面的数据
            this.getAllCarouselData()
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
    // 根据 id 删除
    deleteCarousel(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await get('/carousel/deleteById', {
          id
        })
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新刷新页面数据
          this.getAllCarouselData()
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
    // 启用操作
    async clickStart(row) {
      // console.log('正常');
      await post('/carousel/saveOrUpdate', {
        ...row,
        status: '正常'
      })
      // 重新刷新页面的数据
      this.getAllCarouselData()
    },
    // 停用操作
    async clickOff(row) {
      // console.log('停用');
      await post('/carousel/saveOrUpdate', {
        ...row,
        status: '停用'
      })
      // 重新刷新页面的数据
      this.getAllCarouselData()
    },
    // 预览
    lookCarouselUrl() {
      // 模态框显示出来
      this.dialogUrlVisible = true
    },
    // 关闭预览模态框
    dialogUrlClose() {
      // 关闭模态框
      setTimeout(() => {
        this.dialogUrlVisible = false
      }, 200)
    }
  }
}

</script>
<style scoped>
  .carousel_style,
  .carousel_style img {
    width: 100%;
    height: 350px;
  }

</style>
