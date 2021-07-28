<template>
  <!-- 基础配置页面 -->
  <div class="baseConfig">
    <!-- 头部 -->
    <div class="header">
      <!-- 添加按钮 -->
      <el-button type="primary" @click="addBase">添加</el-button>
    </div>
    <!-- 表格内容展示区域 -->
    <div class="table_content">
      <!-- :data 整个表格的数据源  父容器的100%-->
      <el-table :data="baseData" style="width: 100%">
        <!-- 序号 -->
        <el-table-column label="序号" align="center" type="index" prop="id" />
        <!-- 名称 -->
        <el-table-column prop="name" label="名称" align="center" />
        <!-- 值 -->

        <el-table-column label="值" align="center">
          <template slot-scope="scope">
            <el-image
              v-if="judgeHandler(scope.row.val)"
              style="width: 40px; height: 40px"
              :src="scope.row.val"
              fit="contain"
            />
            <span v-else>{{ scope.row.val }}</span>
          </template>
        </el-table-column>
        <!-- 介绍 -->
        <el-table-column prop="introduce" label="介绍" align="center" />

        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="editWaiter(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteWaiter(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 模态框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @close="dialogClose"
    >
      <el-form
        ref="Base_form"
        :model="BaseForm"
        label-width="80px"
        :rules="rules"
      >
        <!-- 用户名 -->
        <el-form-item label="名称" prop="name">
          <el-input v-model="BaseForm.name" />
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input v-model="BaseForm.introduce" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="value">
            <el-option label="文字" value="文字" />
            <el-option label="图片" value="图片" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="value == '文字'"
          v-model="value"
          label="值"
          prop="val"
        >
          <el-input v-model="BaseForm.val" autocomplete="off" />
        </el-form-item>
        <el-form-item
          v-if="value == '图片'"
          v-model="value"
          label="图片上传"
          prop="val"
        >
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="imageUrl" :src="BaseForm.val" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部按钮操作区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后 -->
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get, post } from '@/utils/request'
import { showFileURL, uploadFileURL } from '@/utils/config'
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        introduce: [{ required: true, message: '请输入介绍', trigger: 'blur' }]
      },
      value: '文字',
      showFileURL,
      uploadFileURL,
      imageUrl: '',
      BaseForm: {},
      baseData: [],
      dialogVisible: false,
      dialogTitle: '新增基础配置'
    }
  },
  computed: {},
  created() {
    this.getBaseAllData()
  },
  mounted() {},
  methods: {
    judgeHandler(val) {
      var bool
      var sub = val.substring(val.lastIndexOf('.') + 1, val.length)
      if (sub === 'jpg' || sub === 'jpeg' || sub === 'png') {
        bool = true
      } else {
        bool = false
      }
      return bool
    },
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.BaseForm.val = this.showFileURL + res.data.id
    },
    beforeUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
    },

    submitForm() {
      this.BaseForm.id = this.$refs['Base_form'].validate(async(valid) => {
        if (valid) {
          // 发生表单验证的请求 提交表单对象

          const res = await post('/baseConfig/saveOrUpdate', this.BaseForm)
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.getBaseAllData()
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
    dialogClose() {
      this.dialogVisible = false
    },
    async getBaseAllData() {
      const res = await get('/baseConfig/findAll')
      this.baseData = res.data
      // console.log(res.data);
    },
    addBase() {
      this.getBaseAllData()
      this.imageUrl = ''
      this.BaseForm = {}
      this.dialogVisible = true
    },
    editWaiter(row) {
      this.title = '编辑基础配置'
      this.dialogVisible = true
      this.BaseForm = { ...row }
      this.value =
        this.BaseForm.val.indexOf('http://') !== -1 ? '图片' : '文字'
      if (this.value === '图片') {
        this.imageUrl = this.BaseForm.val
      }
    },
    async deleteWaiter(id) {
      const res = await get('/baseConfig/deleteById', { id })
      if (res.status === 200) {
        // 重新刷新页面数据
        this.$message({
          message: res.message,
          type: 'success'
        })
        // 重新刷新页面数据
        this.getBaseAllData()
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>
<style scoped>
</style>
