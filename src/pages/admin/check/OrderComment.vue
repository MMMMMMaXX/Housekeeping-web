<template>
  <!-- 订单评论审核 -->
  <div>
    <div class="header">
      <el-input
        v-model="orderContent"
        v-searchDebounceAndThrotFromMx="queryComment"
        style="width: 200px"
        placeholder="请输入关键字"
        clearable
      />
      <el-input
        v-model="orderId"
        v-searchDebounceAndThrotFromMx="queryComment"
        style="width: 200px"
        placeholder="请输入订单编号"
        clearable
      />
      <el-select
        v-model="orderCommentStatus"
        clearable
        placeholder="请选择状态"
      >
        <el-option label="未审核" value="未审核" />
        <el-option label="通过" value="通过" />
        <el-option label="不通过" value="不通过" />
      </el-select>
      <el-button v-buttonThrotFromMx="queryComment" type="primary" round
        >查询</el-button
      >
    </div>
    <div class="table_content">
      <el-table :data="orderComment" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="content" label="评论内容" align="center" />
        <el-table-column prop="customerId" label="顾客编号" align="center" />
        <el-table-column prop="orderId" label="订单编号" align="center" />
        <el-table-column prop="commentTime" label="评论时间" align="center" />
        <el-table-column prop="status" label="评论状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '未审核'" type="info">{{
              scope.row.status
            }}</el-tag>
            <el-tag v-else-if="scope.row.status == '通过'" type="success">{{
              scope.row.status
            }}</el-tag>
            <el-tag v-else-if="scope.row.status == '不通过'" type="warning">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == '未审核'"
              round
              size="mini"
              type="success"
              @click="checkPass(scope.row.id)"
              >通过</el-button
            >
            <el-button
              v-if="scope.row.status == '未审核'"
              round
              size="mini"
              type="warning"
              @click="checkNoPass(scope.row.id)"
              >不通过</el-button
            >

            <el-button
              v-else
              round
              type="danger"
              size="mini"
              @click="deleteById(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  </div>
</template>

<script>
import { get, post } from "@/utils/request";
export default {
  data() {
    return {
      orderContent: "",
      orderId: "",
      orderCommentStatus: "",
      orderComment: [],
      currentPage: 1,
      // 每页要展示的数据条数
      pageSize: 8,
      // 页码展示数据的总条数
      total: 10,
      // 查询的参数
      queryData: {},
    };
  },
  computed: {},
  methods: {
    // 点击查询
    queryComment() {
      console.log("查询了");
      const data = {
        content: this.orderContent,
        status: this.orderCommentStatus,
        orderId: this.orderId,
      };
      // 格式化参数 当某个参数没有值的时候 将其删除
      for (const key in data) {
        if (!data[key]) {
          delete data[key];
        }
      }
      this.queryData = data;
      this.currentPage = 1;
      this.getAllCommentData();
    },
    //操作  不通过
    async checkNoPass(id) {
      await post("/orderComment/checkNoPass", { id });
      this.getAllCommentData();
    },
    //操作  通过
    async checkPass(id) {
      await post("/orderComment/checkPass", { id });
      this.getAllCommentData();
    },
    //操作  删除评论
    async deleteById(id) {
      await get("/orderComment/deleteById", { id });
      this.getAllCommentData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAllCommentData();
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllCommentData();
    },
    //获取全部评论数据
    async getAllCommentData() {
      // 获取参数
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize,
      };
      // 通过对应的参数发送网络请求
      const res = await get("/orderComment/pageQuery", {
        ...data,
        ...this.queryData,
      });
      this.orderComment = res.data.list;
      this.total = res.data.total;
    },
  },
  created() {
    this.getAllCommentData();
  },
  mounted() {},
};
</script>
<style scoped>
.paginetion {
  float: right;
  margin-right: 30px;
}
</style>