<template>
  <div class="dashboard-container">
    <div class="count">
      <div class="customer">
        <div class="title">访问量</div>
        <div class="content">
          <div class="content_1">
            <span>25,848</span>
            <div class="msg">日同比 12.5% 周同比 5%</div>
            <div class="line" />
          </div>
          <div class="flex">
            <div class="flex_item1">总访问量</div>
            <div class="flex_item2">280万</div>
          </div>
        </div>
      </div>

      <div class="customer">
        <div class="title">销售额</div>
        <div class="content">
          <div class="content_1">
            <span>¥12,000</span>
            <div class="msg">
              <el-progress
                style="margin-top: 8px"
                :text-inside="false"
                :stroke-width="12"
                :percentage="70"
              />
            </div>
            <div class="line" />
          </div>
          <div class="flex">
            <div class="flex_item1">总销售额</div>
            <div class="flex_item2">80万</div>
          </div>
        </div>
      </div>

      <div class="customer">
        <div class="title">订单量</div>
        <div class="content">
          <div class="content_1">
            <span>25,848</span>
            <div id="container" />
            <div class="line" />
          </div>
          <div class="flex">
            <div class="flex_item1">转化率</div>
            <div class="flex_item2">60%</div>
          </div>
        </div>
      </div>

      <div class="customer">
        <div class="title">用户</div>
        <div class="content">
          <div class="content_1">
            <span>128位</span>
            <div class="msg">日同比 12.5% 周同比 5%</div>
            <div class="line" />
          </div>
          <div class="flex">
            <div class="flex_item1">总用户</div>
            <div class="flex_item2">10800人</div>
          </div>
        </div>
      </div>
    </div>

    <div class="nav_bar">
      <div v-for="(item, index) in list" :key="index" class="item">
        <router-link :to="item.to">
          <div><img width="32px" height="32px" :src="item.src" /></div>
          <div>{{ item.name }}</div>
        </router-link>
      </div>
    </div>

    <div class="chart">
      <div class="title1">订单量</div>
      <div class="line1" />
      <div class="chart_item">
        <div class="chart_item1">
          <h4>订单趋势</h4>
          <div id="Echart_order" style="height: 260px" />
        </div>
        <div class="chart_item2">
          <h4>订单量排行</h4>
          <div id="Echart_order2" style="height: 280px; width: 600px" />
        </div>
      </div>
    </div>
    <div class="commen">
      <div class="commen_item1">
        <div class="commen_item_title">平均评价</div>
        <div class="commen_item_line">
          <div style="padding: 18px">
            <h2 class="pingfen">4.5</h2>
            <el-rate
              v-model="value"
              style="display: inline; color: 38px"
              disabled
              text-color="#ff9900"
            />
            <el-progress
              style="margin-bottom: 10px; margin-top: 20px"
              :percentage="percentage"
              :color="customColor"
            />
            <el-progress
              style="margin-bottom: 10px"
              :percentage="percentage1"
              :color="customColors"
            />
            <el-progress
              style="margin-bottom: 10px"
              :percentage="percentage2"
              :color="customColors"
            />
            <el-progress
              style="margin-bottom: 10px"
              :percentage="percentage3"
              :color="customColors"
            />
            <el-progress
              style="margin-bottom: 10px"
              :percentage="percentage4"
              :color="customColors"
            />
          </div>
        </div>
      </div>
      <div class="commen_item2">
        <div class="commen_item_title">用户数量</div>
        <div class="commen_item_line" />
        <div id="user_echarts" style="width: 500px; height: 252px" />
      </div>
      <div class="commen_item3">
        <div class="commen_item_title">本月目标</div>
        <div class="commen_item_line">
          <div
            style="
              width: 126px;
              margin: 0 auto;
              text-aglin: center;
              padding-top: 3em;
            "
          >
            <el-progress
              type="dashboard"
              :percentage="percentage"
              color="#1989fa"
            />
            <p
              style="
                width: 300px;
                font-size: 14px;
                color: #515a6e;
                margin-top: 6px;
              "
            >
              恭喜！本月目标已达标
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Area } from "@antv/g2plot";
import { Column } from "@antv/g2plot";
import { Pie } from "@antv/g2plot";

import lanmu from "../../../public/img/栏目.png";
import product from "../../../public/img/产品.png";
import dingdan from "../../../public/img/订单.png";
import guke from "../../../public/img/顾客.png";
import yuangong from "../../../public/img/员工.png";
import tupian from "../../../public/img/图片.png";
import rizi from "../../../public/img/日志.png";
import yonghu from "../../../public/img/用户.png";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      percentage: 90,
      percentage1: 60,
      percentage2: 30,
      percentage3: 10,
      percentage4: 0,
      customColor: "#409eff",
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      value: 4.5,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      list: [
        { name: "栏目", src: lanmu, to: "/admin/category/List" },
        { name: "产品", src: product, to: "/admin/product/List" },
        { name: "订单", src: dingdan, to: "/admin/order/List" },
        { name: "顾客", src: guke, to: "/admin/custome/List" },
        { name: "员工", src: yuangong, to: "/admin/waiter/List" },
        { name: "轮播", src: tupian, to: "/admin/carousel/List" },
        { name: "日志", src: rizi, to: "/admin/log/List" },
        { name: "个人", src: yonghu, to: "/owner/index" },
      ],
      order: [
        { id: 1, name: "家居洗护", num: 367 },
        { id: 2, name: "衣物洗涤", num: 456 },
        { id: 3, name: "看护婴幼儿", num: 124 },
        { id: 4, name: "房屋开荒", num: 467 },
        { id: 5, name: "家庭教育", num: 788 },
        { id: 6, name: "家庭便餐", num: 987 },
        { id: 7, name: "打蜡", num: 12 },
      ],
      data: [
        {
          timePeriod: "2006 Q3",
          value: 1,
        },
        {
          timePeriod: "2006 Q4",
          value: 1.08,
        },
        {
          timePeriod: "2007 Q1",
          value: 1.17,
        },
        {
          timePeriod: "2007 Q2",
          value: 1.26,
        },
        {
          timePeriod: "2007 Q3",
          value: 1.34,
        },
        {
          timePeriod: "2007 Q4",
          value: 1.41,
        },
        {
          timePeriod: "2008 Q1",
          value: 1.52,
        },
        {
          timePeriod: "2008 Q2",
          value: 1.67,
        },
        {
          timePeriod: "2008 Q3",
          value: 1.84,
        },
        {
          timePeriod: "2008 Q4",
          value: 2.07,
        },
        {
          timePeriod: "2009 Q1",
          value: 2.39,
        },
        {
          timePeriod: "2009 Q2",
          value: 2.71,
        },
        {
          timePeriod: "2009 Q3",
          value: 3.03,
        },
        {
          timePeriod: "2009 Q4",
          value: 3.33,
        },
        {
          timePeriod: "2010 Q1",
          value: 3.5,
        },
        {
          timePeriod: "2010 Q2",
          value: 3.37,
        },
        {
          timePeriod: "2010 Q3",
          value: 3.15,
        },
        {
          timePeriod: "2010 Q4",
          value: 3.01,
        },
        {
          timePeriod: "2011 Q1",
          value: 2.8,
        },
        {
          timePeriod: "2011 Q2",
          value: 2.8,
        },
        {
          timePeriod: "2011 Q3",
          value: 2.84,
        },
        {
          timePeriod: "2011 Q4",
          value: 2.75,
        },
        {
          timePeriod: "2012 Q1",
          value: 2.64,
        },
        {
          timePeriod: "2012 Q2",
          value: 2.55,
        },
        {
          timePeriod: "2012 Q3",
          value: 2.46,
        },
        {
          timePeriod: "2012 Q4",
          value: 2.45,
        },
        {
          timePeriod: "2013 Q1",
          value: 2.57,
        },
        {
          timePeriod: "2013 Q2",
          value: 2.68,
        },
        {
          timePeriod: "2013 Q3",
          value: 2.8,
        },
        {
          timePeriod: "2013 Q4",
          value: 2.89,
        },
        {
          timePeriod: "2014 Q1",
          value: 2.85,
        },
        {
          timePeriod: "2014 Q2",
          value: 2.73,
        },
        {
          timePeriod: "2014 Q3",
          value: 2.54,
        },
        {
          timePeriod: "2014 Q4",
          value: 2.32,
        },
        {
          timePeriod: "2015 Q1",
          value: 2.25,
        },
        {
          timePeriod: "2015 Q2",
          value: 2.33,
        },
        {
          timePeriod: "2015 Q3",
          value: 2.53,
        },
        {
          timePeriod: "2015 Q4",
          value: 2.74,
        },
        {
          timePeriod: "2016 Q1",
          value: 2.76,
        },
        {
          timePeriod: "2016 Q2",
          value: 2.61,
        },
        {
          timePeriod: "2016 Q3",
          value: 2.35,
        },
        {
          timePeriod: "2016 Q4",
          value: 2.11,
        },
        {
          timePeriod: "2017 Q1",
          value: 2.08,
        },
        {
          timePeriod: "2017 Q2",
          value: 2.2,
        },
        {
          timePeriod: "2017 Q3",
          value: 2.38,
        },
        {
          timePeriod: "2017 Q4",
          value: 2.59,
        },
        {
          timePeriod: "2018 Q1",
          value: 2.63,
        },
        {
          timePeriod: "2018 Q2",
          value: 2.67,
        },
        {
          timePeriod: "2018 Q3",
          value: 2.64,
        },
        {
          timePeriod: "2018 Q4",
          value: 2.5,
        },
        {
          timePeriod: "2019 Q1",
          value: 2.31,
        },
        {
          timePeriod: "2019 Q2",
          value: 2.04,
        },
        {
          timePeriod: "2019 Q3",
          value: 1.83,
        },
        {
          timePeriod: "2019 Q4",
          value: 1.71,
        },
        {
          timePeriod: "2020 Q1",
          value: 1.65,
        },
        {
          timePeriod: "2020 Q2",
          value: 1.59,
        },
        {
          timePeriod: "2020 Q3",
          value: 1.58,
        },
      ],
    };
  },
  created() {
    setTimeout(() => {
      this.load();
      this.loadCommen();
    }, 500);
  },
  methods: {
    userEchart() {
      var myChart = this.$echarts.init(document.getElementById("user_echarts"));
      var option = {
        legend: {
          top: "bottom",
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: [10, 70],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 5,
            },
            data: [
              { value: 30, name: "一月" },
              { value: 38, name: "二月" },
              { value: 40, name: "三月" },
              { value: 45, name: "四月" },
              { value: 55, name: "五月" },
              { value: 60, name: "六月" },
            ],
          },
        ],
      };
      option && myChart.setOption(option);
    },

    orderEchart() {
      var myChart = this.$echarts.init(document.getElementById("Echart_order"));
      var option = {
        color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["家居洗护", "衣物洗涤", "老人陪护", "房屋开荒", "家庭教育"],
        },

        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
          },
        ],
        yAxis: [
          {
            show: false,
            type: "value",
          },
        ],
        series: [
          {
            name: "家居洗护",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgba(1, 191, 236)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [360, 470, 390, 400, 360, 450, 480],
          },
          {
            name: "衣物洗涤",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 221, 255)",
                },
                {
                  offset: 1,
                  color: "rgba(77, 119, 255)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [320, 270, 260, 310, 300, 340, 210],
          },
          {
            name: "老人陪护",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(55, 162, 255)",
                },
                {
                  offset: 1,
                  color: "rgba(116, 21, 219)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [320, 232, 201, 334, 290, 230, 220],
          },
          {
            name: "房屋开荒",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255, 0, 135)",
                },
                {
                  offset: 1,
                  color: "rgba(135, 0, 157)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [200, 260, 280, 210, 220, 250, 300],
          },
          {
            name: "家庭教育",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255, 191, 0)",
                },
                {
                  offset: 1,
                  color: "rgba(224, 62, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [180, 192, 131, 220, 140, 190, 150],
          },
        ],
      };
      option && myChart.setOption(option);
    },

    orderEchart2() {
      var myChart = this.$echarts.init(
        document.getElementById("Echart_order2")
      );
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        yAxis: {
          type: "category",
          data: ["家庭教育", "房屋开荒", "老人陪护", "衣物洗涤", "家居洗护"],
        },
        xAxis: {
          type: "value",
        },
        series: [
          {
            data: [
              {
                value: 1203,
                itemStyle: {
                  color: "rgba(255, 191, 0,1)",
                },
              },
              {
                value: 1720,
                itemStyle: {
                  color: "rgba(255, 0, 135,1)",
                },
              },
              {
                value: 1827,
                itemStyle: {
                  color: "rgba(55, 162, 255,1)",
                },
              },
              {
                value: 2010,
                itemStyle: {
                  color: "rgba(0, 221, 255,1)",
                },
              },
              {
                value: 2910,
                itemStyle: {
                  color: "rgba(148, 225, 125,1)",
                },
              },
            ],
            type: "bar",
          },
        ],
      };
      option && myChart.setOption(option);
    },

    load() {
      const area = new Area("container", {
        data: this.data,
        xField: "timePeriod",
        yField: "value",
        // xAxis: {
        //   range: [0, 1],
        // },
        xAxis: false,
        yAxis: false,
        color: "#00CC66",
      });
      area.render();
    },

    loadCommen() {
      const data = [
        { type: "顾客", value: 27 },
        { type: "员工", value: 25 },
        { type: "管理员", value: 18 },
      ];

      const piePlot = new Pie("commen_item2_dom", {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6,
        label: {
          type: "inner",
          offset: "-50%",
          content: "{value}",
          style: {
            textAlign: "center",
            fontSize: 14,
          },
        },
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            formatter: () => "AntV\nG2Plot",
          },
        },
      });

      piePlot.render();
    },
  },
  mounted() {
    this.userEchart();
    this.orderEchart();
    this.orderEchart2();
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  background-color: #f5f7f9;
}
.dashboard {
  &-container {
    padding: 0.5em;
    margin: -0.5em;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.count {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.customer {
  flex: 1;
  width: 20%;
  background-color: #fff;
  height: 200px;
  border-radius: 4px;
  margin-right: 10px;
}
.title {
  padding: 14px 16px;
  height: 51px;
  border-bottom: 1px solid #e8eaec;
}
.content {
  padding: 12px;
  height: 149px;
}

.content_1 span {
  font-size: 30px;
  color: #515a6e;
}
.msg {
  width: 100%;
  height: 42px;
  padding-top: 8px;
  font-size: 14px;
  color: #515a6e;
  box-sizing: border-box;
  line-height: 30px;
}
.line {
  margin: 8px 0px;
  height: 1px;
  background-color: #e8eaec;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 30px;
}
.flex_item1,
.flex_item2 {
  color: #515a6e;
  font-size: 14px;
}
#container {
  height: 42px;
}
.nav_bar {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.nav_bar .item {
  width: 100px;
  height: 93px;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
}
.nav_bar .item:hover {
  box-shadow: #ccc 0px 0px 12px;
  cursor: pointer;
}
.nav_bar .item div {
  text-align: center;
  font-size: 14px;
  color: #515a6e;
}
.nav_bar .item div:last-child {
  margin-top: 10px;
}
.chart {
  height: 366px;
  background-color: #fff;
  margin-top: 20px;
  border-radius: 4px;
}
.title1 {
  height: 48px;
  padding: 0 20px;
  line-height: 48px;
  color: #515a6e;
  font-size: 14px;
}
.line1 {
  height: 1px;
  background-color: #e8eaec;
}
.chart_item {
  display: flex;
}
.chart_item1 {
  flex: 1.7;
  height: 317px;
  padding: 0 20px;
}
.chart_item2 {
  flex: 1;
  height: 317px;
}
.chart_dom2 .phang {
  height: 28px;
  margin-bottom: 8px;
}
.phang_item1 {
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #e6f6ff;
  line-height: 22px;
  text-align: center;
  color: #1791ff;
}
.phang_item2 {
  margin-left: 6px;
  font-size: 13px;
  color: #515a6e;
}
.phang_item3 {
  float: right;
  font-size: 13px;
  color: #515a6e;
  line-height: 2;
}
.commen {
  display: flex;
  justify-content: space-around;
  margin-top: 2em;
}
.commen_item1 {
  flex: 2;
  height: 300px;
  margin-right: 1em;
  border-radius: 4px;
  background-color: #fff;
}
.commen_item2 {
  flex: 1;
  height: 300px;
  margin-right: 1em;
  border-radius: 4px;
  background-color: #fff;
}
.commen_item3 {
  flex: 1;
  height: 300px;
  margin-right: 1em;
  border-radius: 4px;
  background-color: #fff;
}
.commen_item_title {
  padding: 0 18px;
  height: 48px;
  line-height: 48px;
  color: #515a6e;
  font-size: 14px;
}
.commen_item_line {
  height: 1px;
  background-color: #e8eaec;
}
.pingfen {
  display: inline;
  font-size: 48px;
  color: #515a6e;
  font-weight: 400;
  margin-right: 18px;
}
.commen_item2_dom {
  height: 200px;
}
</style>
