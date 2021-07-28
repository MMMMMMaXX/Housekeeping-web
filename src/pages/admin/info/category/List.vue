<template>
  <!-- 资讯分类管理 -->
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="addInfo">新增</el-button>
    <!-- 表格内容展示区 -->
    <div class="table_content">
      <!-- :data 整个表格的数据源 -->
      <el-table :data="userData" style="width: 100%">
        <!-- 序号 -->
        <el-table-column type="index" label="序号" align="center" />
        <!-- 编号 -->
        <el-table-column prop="id" label="编号" align="center" />
        <!-- 名称 -->
        <el-table-column prop="name" label="名称" align="center" />
        <!-- 排序号 -->
        <el-table-column prop="no" label="排序号" align="center" />
        <!-- 描述 -->
        <el-table-column prop="description" label="描述" align="center" />

        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="color:green" @click="editInfo(scope.row)">编辑</el-button>
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
    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
      <!-- 表单区域 -->
      <!-- model 表单对象， 最终我们要提交的那个表单对象 -->
      <!-- :rules 表单验证的规则 -->
      <!-- ref 类比与 id 最终通过ref 找到这张表单 -->
      <el-form ref="User_form" :model="UserForm" :rules="rules" label-width="80px">
        <!-- 用户名 -->
        <el-form-item label="栏目名称" prop="name">
          <el-input v-model="UserForm.name" />
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="排序号" prop="no">
          <el-input v-model="UserForm.no" />
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="栏目介绍" prop="description">
          <el-input v-model.number="UserForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部操作按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后，调用重置表单的方法 -->
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入axios
import { get, post } from '@/utils/request'
export default {
  data() {
    return {
      // 表单对象
      UserForm: {
        // 栏目名称
        name: '',
        // 序号
        no: '',
        // 栏目介绍
        description: ''
      }, // 表单验证规则
      rules: {
        // 栏目名称
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        // 序号
        no: [{ required: true, message: '请选择序号', trigger: 'blur' }],
        // 栏目介绍
        description: [
          { required: true, message: '请输入栏目介绍', trigger: 'blur' }
        ]
      },
      // 模态框是否显示
      dialogVisible: false,
      // 模态框标题
      dialogTitle: '添加资讯分类',
      // 资讯数组 - 表格的数据源的数据
      userData: [],
      // 资讯分类编号
      id: '',
      // 名称
      name: '',
      // 排序号
      no: '',
      // 描述
      description: ''
    }
  },
  computed: {},
  created() {
    this.getAllLogData()
  },
  mounted() {},
  methods: {
    // 打开模态框
    dialogOpen() {
      // 清空表单对象
      this.UserForm = {}
      this.dialogVisible = true
    },
    // 关闭模态框
    dialogClose() {
      this.dialogVisible = false
    },
    // 新增
    addInfo() {
      // 打开模态框
      this.dialogOpen()
      this.dialogTitle = '新增栏目信息'
    },
    // 编辑
    editInfo(row) {
      // 打开模态框
      this.dialogOpen()
      this.UserForm = { ...row }
      this.dialogTitle = '编辑栏目信息'
    },
    // 删除
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
      const res = get('/category/deleteById', { id })
      // 给用户一个成功或失败的提示
      if (res.status === 200) {
        this.$message({
          message: res.message,
          type: 'success'
        })
        // 重新刷新页面
        this.getAllLogData()
      } else {
        this.$message.error(res.message)
      }
    },
    // 表单提交 更新或编辑产品信息
    submitForm() {
      this.$refs['User_form'].validate(async(valid) => {
        if (valid) {
          // 发送表单验证请求  提交表单对象
          const res = await post('/category/saveOrUpdate', this.UserForm)
          if (res.status === 200) {
            // 给用户一个成功地提示
            alert('提交成功!')
            // 刷新表单
            this.$refs['User_form'].resetFields()
            // 自动的获取用户数据
            this.getAllLogData()
            // 调用关闭模态框
            setTimeout(() => {
              this.dialogVisible = false
            }, 200)
          } else {
            alert('提交失败!')
          }
        } else {
          return false
        }
      })
    },

    // 分页获取所有log的数据
    async getAllLogData() {
      // 通过对应的参数发送网络请求 获取用户数组数据
      const res = await get('/category/findAll')
      // 将data中的产品数组 进行赋值
      this.userData = res.data

      // console.log(res);
    }
  }
}
</script>
<style >
</style>
