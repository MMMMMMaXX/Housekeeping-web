<template>
  <!-- 发布资讯页面 -->
  <div>
    <div class="header_w">
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
      <span class="span_2" @click="$router.back()">返回</span>
      <el-button type="primary" @click="submitForm()">发布</el-button>
    </div>
  </div>
</template>

<script>
// 引入axios
import { get, post } from '@/utils/request'
// 引入富文本Tinymce
import Tinymce from '@/components/Tinymce'
// 引入文件上传路径 和 文件预览的路径
import { showFileURL, uploadFileURL } from '@/utils/config'
export default {
  components: { Tinymce },
  data() {
    return {
      // 图片预览的路径
      imageUrl: '',
      // 上传的服务器地址
      uploadFileURL,
      // 标题
      articleTitle: '',
      // 栏目下拉框
      articleValue: '',
      // 栏目数组
      categoryArr: [],

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
    this.getCategory()
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
    // 遍历所有栏目
    async getCategory() {
      const res = await get('/category/findAll')
      this.categoryArr = res.data
      // console.log(res.data);
    }
  }
}
</script>
<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.span_2 {
  display: inline-block;
  margin-left: 90%;
  font-size: 12px;
  padding-right: 20px;
  color: #2cb5ac;
  cursor: pointer;
}
</style>
