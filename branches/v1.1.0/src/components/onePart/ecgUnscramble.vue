<template>
  <div class="heart_check_ss">
    <div class="unscramble_title">国家远程医疗与互联网医学中心</div>
    <div class="ecgReport" @click="viewDetails">
      <div class="history_content">
        <div class="scoreResult">
          {{ ecgData.heartStatus }}
          <!--疑似心房颤动-->
        </div>
        <div class="scoreResult">
          <van-icon class="iconLike" name="like" />
          <span>{{ ecgData.heartRate }}bpm</span>
        </div>

        <div class="ecgPic">
          <img
            :class="{ activeImg: imgShow }"
            :src="ecgData.ecgImageIndexPath"
          />
          <!--<img src="../../assets/image/ecg.png" />-->
        </div>
        <div class="recordTime">
          <div>{{ ecgData.takeTime | dateDotFilter }}</div>
          <div>时长：{{ ecgData.length }}s</div>
        </div>
      </div>
    </div>
    <div class="user_message">
      <div class="message_title">个人信息</div>
      <div class="details_message">
        <div>
          姓名
          <span class="physiology">{{ messageData.userName }}</span>
        </div>
        <div>
          性别
          <span class="physiology">{{ messageData.userSex | sexFilter }}</span>
        </div>
        <div>
          年龄
          <span class="physiology">{{ messageData.userAge }}</span>
        </div>
      </div>
      <div class="apply_time">
        申请解读时间
        <span class="physiology">
          {{ messageData.applicationTime | dateDotFilter }}
        </span>
      </div>
      <van-cell title="健康档案" is-link @click="caseInformation" />
    </div>
    <div class="unscramble_doctor">
      <div class="doctor_title">解读医生</div>
      <div class="doctor_data">
        <div>
          <img :src="messageData.doctorPhoto" />
        </div>
        <div class="doctor_message">
          <div class>
            <span class="tb">{{ messageData.doctorName }}</span>
            <span class="doctor_position">
              {{ messageData.doctorAcademicTitle }}
            </span>
          </div>
          <div class="doctor_hospital">{{ messageData.doctorHospital }}</div>
        </div>
      </div>
    </div>
    <div class="unscramble_result">
      <div class="result_title">解读结果</div>
      <div class="ecg_result">{{ messageData.interpretationResults }}</div>
      <div class="signed">
        <img :src="messageData.doctorSignUrl" />
        <!--<img src="../../../public/logo.png"/>-->
        <div class="signed_date">
          {{ messageData.auditDate | getDatesFilter }}
        </div>
      </div>
    </div>
    <!--  -->
    <div class="d_btn">下载心电解读报告</div>
  </div>
</template>

<script>
import Vue from "vue";
import util from "@/lib/util";
import { formatDate, dateDot, getDates } from "@/lib/time";
import { Icon, Cell, CellGroup, Field } from "vant";
import "vant/lib/index.css";
Vue.use(Icon)
  .use(Cell)
  .use(CellGroup)
  .use(Field);

export default {
  data() {
    return {
      reportId: "",
      ecgData: {},
      messageData: {},
      imgShow: false
    };
  },
  created() {
    if (JSON.stringify(this.$route.params) == "{}") {
      this.ecgData = JSON.parse(localStorage.getItem("ecgData"));
      this.messageData = JSON.parse(localStorage.getItem("messageData"));
      return;
    }
    if (this.$route.params.type === 1) {
      //type（来源）: 1=系统消息-人工解读 2=心电报告
      this.get_user_ecg_info();
    } else if (this.$route.params.type === 2) {
      this.get_user_ecg_infos();
    }
    // let Url = window.location.href;
    // let num = Url.indexOf("reportId=");
    // if (num == -1) {
    //   this.$toast("reportId获取不到");
    // } else {
    //   num = num + 9;
    //   this.reportId = Url.substring(num);
    // }
    // this.obtainData();
  },
  methods: {
    //获取 报告头部心电图
    async get_ecg_img(reportId) {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002001012"
          },
          body: {
            reportId
          }
        };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.ecgData = res.data.body.data;
          localStorage.setItem("ecgData", JSON.stringify(this.ecgData));
          this.imgShow = this.ecgData.ecgImageIndexPath ? true : false;
        } else {
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.$toast("网络连接不稳定，请检查网络！");
      }
    },
    //查询人工解读报告
    async get_user_ecg_info() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002013001"
          },
          body: {
            id: this.$route.params.id
          }
        };
      this.$toast("加载中···");
      try {
        let res = await util.ajax.post(Url, params);
        this.$toast.clear();
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.messageData = res.data.body.data;
          localStorage.setItem("messageData", JSON.stringify(this.messageData));
          this.get_ecg_img(this.messageData.reportId);
          this.$toast.clear();
        } else {
          this.$toast.clear();
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.$toast.clear();
        console.log(e);
        this.$toast("网络连接不稳定，请检查网络！");
      }
    },
    // 根据reportId查询人工解读报告
    async get_user_ecg_infos() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "HWW002013002"
          },
          body: {
            reportId: this.$route.params.reportId
          }
        };
      this.$toast("加载中···");
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        this.$toast.clear();
        if (res.data.respHead.respCode === "000") {
          this.messageData = res.data.body.data;
          localStorage.setItem("messageData", JSON.stringify(this.messageData));
          this.get_ecg_img(this.$route.params.reportId);
          this.$toast.clear();
        } else {
          this.$toast.clear();
          this.$toast(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.$toast.clear();
        console.log(e);
        this.$toast("网络连接不稳定，请检查网络！");
      }
    },
    obtainEcg() {
      let self = this;
      let Url = "";
      let reportId = this.messageData.reportId; //36020
      let params = {
        reqHead: {
          functionId: "HWW003007004"
        },
        body: {
          reportId: reportId
        }
      };
      util.ajax
        .post(Url, params)
        .then(function(res) {
          // self.$toast.clear();
          console.log(res);
          self.ecgData = res.data.body.data;
          if (self.ecgData.ecgImageIndexPath) {
            self.imgShow = true;
          }
        })
        .catch(function(err) {
          // self.$toast.clear();
          console.log(err);
        });
    },
    obtainData() {
      let self = this;
      let Url = "";
      let reportId = this.reportId; //36020
      let params = {
        reqHead: {
          functionId: "HWW003007001"
        },
        body: {
          reportId: reportId
        }
      };
      util.ajax
        .post(Url, params)
        .then(function(res) {
          // self.$toast.clear();
          console.log(res);
          self.messageData = res.data.body.data;
          self.obtainEcg();
        })
        .catch(function(err) {
          // self.$toast.clear();
          console.log(err);
        });
    },
    viewDetails() {
      document.title = "心电图";
      //window.location.href = `http://122.225.207.105:8080/pacs/h5chart/view?file_id=${this.messageData.anaecgFileId}`;
      window.location.href = `http://api.995120.cn/pacs/h5chart/view/?file_id=${this.messageData.anaecgFileId}`;
    },
    caseInformation() {
      this.$router.push({
        name: "Upload",
        params: {
          is_im: 3,
          info_id: this.messageData.medicalInformationId
        }
      });
    }
  },
  computed: {},
  filters: {
    formatDateFilter(val) {
      if (val == "") {
        return "";
      } else {
        return formatDate(val);
      }
    },
    dateDotFilter(val) {
      if (val == "") {
        return "";
      } else {
        return dateDot(val);
      }
    },
    getDatesFilter(val) {
      if (val == "") {
        return "";
      } else {
        return getDates(val);
      }
    },
    sexFilter(val) {
      if (val == 0) {
        return "男";
      } else {
        return "女";
      }
    }
  }
};
</script>

<style lang="scss">
.heart_check_ss {
  height: 100%;
  background: #f2f2f2;
  .d_btn {
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    background-color: #fb6522;
    text-align: center;
  }
}
.heart_check_ss .unscramble_title {
  font-size: 16px;
  color: #333;
  padding-top: 8px;
  margin-bottom: 12px;
  text-align: center;
}
.heart_check_ss .ecgReport {
  box-sizing: border-box;
  background: #fff;
  font-size: 14px;
  text-align: left;
  color: #4c4c4c;
  border-radius: 6px;
  padding: 16px;
  padding-bottom: 10px;
  margin-bottom: 8px;
}
.heart_check_ss .scoreResult {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.heart_check_ss .iconLike {
  font-size: 16px;
  vertical-align: middle;
  margin-right: 6px;
  color: #e95f5f;
}
.heart_check_ss .recordTime {
  display: flex;
  justify-content: space-between;
  height: 32px;
  line-height: 32px;
}
.heart_check_ss .ecgPic {
  /*padding-bottom: 4px;*/
}
.heart_check_ss .ecgPic img {
  height: 90px;
  width: 100%;
}
.heart_check_ss .ecgPic .activeImg {
  height: 90px;
}
.heart_check_ss .user_message {
  width: 100%;
  background: #ffffff;
  text-align: left;
}
.heart_check_ss .message_title {
  font-size: 16px;
  padding-top: 12px;
  margin-left: 4%;
}
.heart_check_ss .details_message {
  display: flex;
  margin-top: 12px;
  margin-left: 4%;
  margin-right: 4%;
  font-size: 14px;
  color: #979797;
  justify-content: space-between;
  text-align: left;
}
.heart_check_ss .apply_time {
  padding: 12px 4%;
  font-size: 14px;
  color: #979797;
  border-bottom: 1px solid #f2f2f2;
}
.heart_check_ss .unscramble_doctor {
  width: 100%;
  background: #ffffff;
  text-align: left;
  padding: 16px;
  margin-top: 8px;
  box-sizing: border-box;
}
.heart_check_ss .doctor_title {
  font-size: 16px;
}
.heart_check_ss .doctor_data {
  display: flex;
  margin-top: 12px;
}
.heart_check_ss .doctor_data img {
  width: 60px;
  /*height: 70px;*/
}
.heart_check_ss .doctor_message {
  margin-left: 12px;
  line-height: 33px;
  color: #333;
  font-size: 12px;
}
.heart_check_ss .doctor_message .tb {
  display: inline-block;
  font-size: 18px;
}
.heart_check_ss .doctor_position {
  margin-left: 8px;
}
.heart_check_ss .doctor_hospital {
  font-size: 14px;
  color: #979797;
}
.heart_check_ss .unscramble_result {
  width: 100%;
  background: #ffffff;
  text-align: left;
  margin-top: 12px;
  padding-bottom: 20px;
}
.heart_check_ss .result_title {
  font-size: 16px;
  padding: 12px 4%;
  /*border-bottom: 1px solid #eee;*/
}
.heart_check_ss .physiology {
  color: #333333;
  margin-left: 6px;
}
.heart_check_ss .ecg_result {
  width: 92%;
  margin-left: 4%;
  line-height: 24px;
  font-size: 14px;
  text-indent: 2em;
  /*margin-top: 10px;*/
}
.heart_check_ss .signed {
  text-align: right;
  margin-right: 4%;
  margin-top: 10px;
  & img {
    width: 90px;
    height: 48px;
  }
}
.heart_check_ss .signed_date {
  font-size: 14px;
  color: #888;
}
</style>
