<template>
  <!-- 员工实名认证审核 -->
  <div>
    <!-- 头部区域 -->
    <div class="header">
      <!-- 时间日期选择器 -->
      <el-date-picker
        v-model="selectTime"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      <!-- 实名认证状态下拉框 -->
      <el-select
        style="width: 250px; margin-left: 10px"
        v-model="certificationStatus"
        clearable
        placeholder="请选择状态"
      >
        <el-option label="通过" value="通过"> </el-option>
        <el-option label="不通过" value="不通过"> </el-option>
        <el-option label="未审核" value="未审核"> </el-option>
      </el-select>
      <!-- 申请人编号输入框 -->
      <el-input
        style="width: 250px; margin-left: 10px"
        placeholder="申请人编号"
        v-model="certificationID"
        clearable
      >
      </el-input>
      <!-- 查询按钮 -->
      <el-button
        style="margin-left: 10px"
        type="primary"
        @click="querycertification"
        >查询</el-button
      >
    </div>
    <!-- 主体内容 -->
    <div class="content">
      <!-- 表格内容展示区域 -->
      <el-table :data="tableData" style="width: 100%" size="mini">
        <!-- 序号 -->
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <!-- 申请人编号 -->
        <el-table-column
          prop="userId"
          label="申请人编号"
          align="center"
          width="100"
        >
        </el-table-column>
        <!-- 姓名 -->
        <el-table-column
          prop="realname"
          label="姓名"
          align="center"
          width="100"
        >
        </el-table-column>
        <!-- 申请时间 -->
        <el-table-column
          prop="applyTime"
          label="申请时间"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <div>
              {{ moment(scope.row.applyTime).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </template>
          <!-- {{ moment(tableData.applyTime | fmDate).format("YYYY-MM-DD HH:mm:ss") }} -->
        </el-table-column>
        <!-- 身份证号 -->
        <el-table-column
          prop="idCard"
          label="身份证号"
          align="center"
          width="180"
        >
        </el-table-column>
        <!-- 身份证正面 -->
        <el-table-column
          prop="idcardPhotoPositive"
          label="身份证正面"
          align="center"
          width="80"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: 30px"
              :src="scope.row.idcardPhotoPositive"
              :preview-src-list="[scope.row.idcardPhotoPositive]"
            >
            </el-image>
          </template>
        </el-table-column>
        <!-- 身份证反面 -->
        <el-table-column
          prop="idcardPhotoNegative"
          label="身份证反面"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: 30px"
              :src="scope.row.idcardPhotoNegative"
              :preview-src-list="[scope.row.idcardPhotoNegative]"
            >
            </el-image>
          </template>
        </el-table-column>
        <!-- 银行卡号 -->
        <el-table-column
          prop="bankCard"
          label="银行卡号"
          widt
          align="center"
          width="180"
        >
        </el-table-column>
        <!-- 银行卡 -->
        <el-table-column
          prop="bankCardPhoto"
          label="银行卡"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: 30px"
              :src="scope.row.bankCardPhoto"
              :preview-src-list="[scope.row.bankCardPhoto]"
            >
            </el-image>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '通过'" type="success">{{
              scope.row.status
            }}</el-tag>
            <el-tag v-if="scope.row.status == '不通过'" type="danger">{{
              scope.row.status
            }}</el-tag>
            <el-tag v-if="scope.row.status == '未审核'" type="info">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button
              @click="deleteClick(scope.row.id)"
              type="text"
              size="small"
              >撤销</el-button
            >
            <el-button
              @click="clickCheckNoPass(scope.row.id)"
              style="color: red"
              v-if="scope.row.status == '未审核'"
              type="text"
              size="small"
              >不通过</el-button
            >
            <el-button
              @click="clickCheckPass(scope.row.id)"
              style="color: blue"
              v-if="scope.row.status == '未审核'"
              type="text"
              size="small"
              >通过</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部分页区域 -->
    <div class="pagination">
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 引入axios
import { get, post } from "@/utils/request";
// 引入moment
let moment = require("moment");
export default {
  data() {
    return {
      // 表格数据源
      tableData: [],
      // 日期时间选择器绑定值
      selectTime: "",
      // 时间日期选择器快捷选项
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // 实名认证状态-下拉框
      certificationStatus: "",
      // 申请人编号
      certificationID: "",
      // 当前页码
      currentPage: 1,
      // 每页要展示的数据条数
      pageSize: 10,
      // 页面展示数据的总条数
      total: 10,
      //查询参数
      queryData: [],
    };
  },
  computed: {},
  methods: {
    moment,
    // 分页获取所有数据
    async getAllData() {
      let data = {
        page: this.currentPage,
        pageSize: this.pageSize,
      };
      let res = await get("/certification/pageQueryCertificationApply", {
        ...data,
        ...this.queryData,
      });
      // console.log(res);
      this.tableData = res.data.list;
      this.total = res.data.total;
    },
    // 分页
    // 控制每页数据条数，val：每页要展示的数据条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      // 将每页要展示的数据的条数进行更新
      this.pageSize = val;
      // 将当前的页数重置到第一页
      this.currentPage = 1;
      // 重新调用获取所有产品数据的方法
      this.getAllData();
    },
    // 控制当前显示的页数，val：当前的页码
    handleCurrentChange(val) {
      // 将当前页数与分页插件动态点击控制的页数相绑定
      this.currentPage = val;
      // 重新调用获取所有产品数据的方法
      this.getAllData();
      // console.log(`当前页: ${val}`);
    },
    //审核通过，参数为申请员工的id
    async clickCheckPass(id) {
      let res = await get("/certification/checkPass", { id });
      // console.log(res);
      //给用户一个成功或失败的提示，然后重新刷新页面
      if (res.status == 200) {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getAllData();
      } else {
        this.$message.error(res.message);
      }
    },
    //审核不通过
    async clickCheckNoPass(id) {
      let res = await get("/certification/checkNoPass", { id });
      // console.log(res);
      //给用户一个成功或失败的提示，然后重新刷新页面
      if (res.status == 200) {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getAllData();
      } else {
        this.$message.error(res.message);
      }
    },
    //根据条件模糊查询实名认证的数据
    querycertification() {
      let data = {
        beginTime: Date.parse(this.selectTime[0]),
        endTime: Date.parse(this.selectTime[1]),
        status: this.certificationStatus,
        userId: this.certificationID,
      };
      // console.log(data);
      //格式化参数，当某个属性没有值的时候将其删除
      for (const key in data) {
        // console.log(data[key]);
        if (!data[key]) {
          delete data[key];
        }
      }
      // console.log(data);
      this.queryData = data;
      this.currentPage = 1;
      this.getAllData();
      this.selectTime = "";
    },
    // 撤销实名认证申请
    async deleteClick(id) {
      let res = await get("/certification/revokeCertificationApply", { id });
      // console.log(res);
      if (res.status == 200) {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getAllData();
      } else {
        this.$message.error(res.message);
      }
    },
  },
  created() {
    this.getAllData();
  },
  mounted() {},
};
</script>
<style scoped>
/* 设置头部样式 */
.header {
  line-height: 40px;
  margin-bottom: 10px;
}
/* 分页区域的样式 */
.pagination {
  position: fixed;
  bottom: 40px;
  right: 15px;
}
</style>