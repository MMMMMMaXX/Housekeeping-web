<template>
  <!-- 资讯评论审核 -->
  <div class="InfoComment">
    <div class="header">
      <el-button type="danger" @click="SelectionDelete">批量删除</el-button>
      <el-input
        v-model="keyWord"
        v-searchDebounceAndThrotFromMx="queryInfo"
        clearable
        placeholder="请输入评论内容进行查询"
        prefix-icon="el-icon-search"
        class="keyInput"
      />
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="InfoData"
        max-height="250"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="65" />
        <el-table-column align="center" width="150" prop="id" label="序号" />
        <el-table-column align="center" prop="comment" label="评论内容" />
        <el-table-column align="center" prop="userId" label="评论人编号" />
        <el-table-column align="center" prop="articleId" label="资讯编号" />
        <el-table-column align="center" label="评论时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ moment(scope.row.commentTime).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="评论状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '通过'" type="success">
              {{ scope.row.status }}
            </el-tag>
            <el-tag v-else-if="scope.row.status == '未审核'" type="warning">
              {{ scope.row.status }}
            </el-tag>
            <el-tag v-else type="danger">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              style="color: red"
              type="text"
              size="small"
              @click="clickDelete(scope.row.id)"
            >删除</el-button>
          </template>
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
import { get, post } from '@/utils/request'
const moment = require('moment')
export default {
  data() {
    return {
      moment,
      // 查找关键字
      keyWord: '',
      // 资讯评论
      InfoData: [],
      // 当前的页码
      currentPage: 1,
      // 每页要展示的数据条数
      pageSize: 8,
      // 页面展示数据的总条数
      total: 10,
      // 接受多选的数据
      multipleSelection: [],
      // 查询参数
      queryData: []
    }
  },
  computed: {},
  created() {
    this.getAllInfo()
  },
  mounted() {},
  methods: {
    // 控制每页数据条数
    handleSizeChange(val) {
      // 更新每页展示的条数
      this.pageSize = val
      // 回到第一页
      this.currentPage = 1
      // 获取所有数据
      this.getAllInfo()
    },

    //  控制当前显示的页数
    handleCurrentChange(val) {
      // 将当前页数 与 分页插件动态点击控制的页数相绑定
      this.currentPage = val
      // 获取所有数据
      this.getAllInfo()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val

      console.log(this.multipleSelection, '232323')
    },
    // 批量删除
    async SelectionDelete() {
      const ids = this.multipleSelection.map((item) => {
        return item.id
      })
      const res = await post('/comment/batchDelete', { ids })
      // 给用户一个成功或失败的提示
      if (res.status === 200) {
        this.$message({
          message: res.message,
          type: 'success'
        })
        // 重新刷新页面
        this.getAllInfo()
      } else {
        this.$message.error(res.message)
      }
    },
    //  获取全部资讯评论
    async getAllInfo() {
      const data = {
        page: 1,
        pageSize: 100
      }
      const res = await get('/comment/pageQuery', {
        ...data,
        ...this.queryData
      })
      this.InfoData = res.data.list
      this.total = res.data.total
      console.log(this.InfoData)
    },
    // 模糊查询
    queryInfo() {
      const data = {
        keywords: this.keyWord
      }
      // 当无输入时，查询时进行删除
      for (const key in data) {
        if (!data[key]) {
          delete data[key]
        }
      }
      this.queryData = data
      // 回到第一页
      this.currentPage = 1
      // 重新加载
      this.getAllInfo()
    },
    // 单个删除
    async clickDelete(id) {
      console.log(id)
      const res = await get('/comment/deleteById', { id })
      // 给用户一个成功或失败的提示
      if (res.status === 200) {
        this.$message({
          message: res.message,
          type: 'success'
        })
        // 重新刷新页面
        this.getAllInfo()
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>
<style scoped>
.keyInput {
  width: 300px;
}
.paginetion {
  position: fixed;
  bottom: 30px;
  right: 30px;
}
</style>
