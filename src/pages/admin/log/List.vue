<!--
 * @Author: your name
 * @Date: 2021-07-02 16:47:18
 * @LastEditTime: 2021-07-06 09:16:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \shixun2\xm\briup_shixun2\briup-web\src\pages\admin\log\List.vue
-->
<template>
  <!-- 日志管理页面 -->
  <div>
    <!-- 表格内容展示区 -->
    <div class="table_content">
      <!-- :data 整个表格的数据源 -->
      <el-table :data="userData" style="width: 100%">
        <!-- 序号 -->
        <el-table-column type="index" label="序号" align="center" />
        <!-- 编号 -->
        <el-table-column prop="id" label="编号" align="center" />
        <!-- 访问人真实姓名 -->
        <el-table-column prop="realname" label="访问人真实姓名" align="center" />
        <!-- 访问方式 -->
        <el-table-column prop="method" label="访问方式" align="center" />
        <!-- 访问路径 -->
        <el-table-column prop="content" label="访问路径" align="center" />
        <!-- 访问时间 -->
        <el-table-column label="访问时间" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">{{ scope.row.logTime | fmtDate }}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部分页区域 -->
    <div class="paginetion">
      <!-- 分页组件 -->
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
  </div>
</template>

<script>
// 引入axios
import { get } from '@/utils/request'
export default {
  data() {
    return {
      // 日志数组 - 表格的数据源的数据
      userData: [],
      // 访问编号
      id: '',
      // 访问人真实姓名
      realname: '',
      // 访问方式
      method: '',
      // 访问路径
      content: '',
      // 访问时间
      logTime: '',
      // 当前的页码
      currentPage: 1,
      // 每页要展示的数据条数
      pageSize: 8,
      // 页面展示数据的总条数
      total: 10
    }
  },
  computed: {},
  created() {
    this.getAllLogData()
  },
  mounted() {},
  methods: {
    // 控制每页数据条数  val 每页要展示的数据条数
    handleSizeChange(val) {
      // 将每页要展示的数据的条数 进行一个更新
      this.pageSize = val
      // 将当前的页数 重置到第一页
      this.currentPage = 1
      // 重新调用获取所有用户数据的方法
      this.getAllLogData()
    },

    //  控制当前显示的页数 val 当前的页码
    handleCurrentChange(val) {
      // 将当前页数 与 分页插件动态点击控制的页数相绑定
      this.currentPage = val
      // 重新调用获取所有用户数据的方法
      this.getAllLogData()
    },
    // 分页获取所有log的数据
    async getAllLogData() {
      // 获取参数
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      // 通过对应的参数发送网络请求 获取用户数组数据
      const res = await get('/baseLog/pageQuery', {
        ...data
      })
      // 将data中的产品数组 进行赋值
      this.userData = res.data.list
      // 页面总数据条数 赋值
      this.total = res.data.total
    }
  }
}
</script>
<style >
/* 分页区域的样式 */
.paginetion {
  position: fixed;
  bottom: 30px;
  right: 10px;
}
</style>
