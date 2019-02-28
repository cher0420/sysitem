<template>
  <section>
    <section class="search box-sizing">
      <el-input class='searchInput' size='small' v-model="keyWords" placeholder="搜索机器人名称或描述" @keyup.enter.native="search"><i
        slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
    </section>
    <el-table
      v-loading="loading"
      class="margin-top20"
      :data="tableData"
      border
      stripe
      row-key="RecordId"
    >
      <el-table-column
        prop="AliasName"
        label="机器人名称"
        :resizable="resizable"
      >
      </el-table-column>
      <el-table-column
        prop="Description"
        label="描述"
        min-width="220"
        :resizable="resizable"
      >
      </el-table-column>
      <el-table-column
        prop="StatusString"
        label="状态"
        :resizable="resizable"
        :render-header="renderProductId"
        min-width="40"
      >
        <template slot-scope="scope">
          <span :style="{'color': scope.row.StatusString === '已创建'? '#555':'#999'}">
            {{ scope.row.StatusString }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreateDate"
        label="创建时间"
        min-width="50"
        :resizable="resizable"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.Status == 0||scope.row.Status == 1||scope.row.Status == 6">
            -
          </span>
          <span v-else>
            {{scope.row.CreateDate}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="230"
        :resizable="resizable"
      >
        <template slot-scope="scope">
          <span class="yoy-list-todo c555">
            <span v-if="scope.row.Status == 2||scope.row.Status == 5">
              <span class="config">
                <i class="el-icon-setting"></i>
                <span class="c555"
                   @click="go('/bot/config',scope.row.RecordId,scope.row.AliasName)">配置</span>
              </span>
              <span class="del">
                <i class="el-icon-delete"></i>
                <a href="javascript:;" class="c555" @click="del(scope.$index,scope.row)">删除</a>
              </span>
            </span>
            <span class="yoy-botList-create" v-else-if="scope.row.Status==1">
              <span class="primary-color">
                <i class="el-icon-refresh rotate360"></i>
                <span class="creating">创建中...</span>
                <span class="wait">（ 预计需要三分钟 ）</span>
              </span>
            </span>
            <span class="yoy-botList-create" v-else-if="scope.row.Status==3">
              <span class="danger-color">
                <i class="el-icon-refresh rotate360"></i>
                <span class="creating">删除中...</span>
                <span class="wait">（ 预计需要三分钟 ）</span>
              </span>
            </span>
            <span v-else class="create" v-else-if="scope.row.Status==0||scope.row.Status==6">
                <i class="el-icon-plus"></i>
                <a href="javascript:;" class="c555" @click="create(scope.$index,scope.row)">创建</a>
              </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--<section class="">-->
      <el-pagination
        @current-change="handleCurrentChange"
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="PageIndex"
      >
      </el-pagination>
    </section>
</template>
<script>
  import DrapDown from '../../components/DrapDown'
  import {BOTLIST, ITEMKEY} from './constants'
  import URL from '../../host/baseUrl'
  import {BOT, DELETEBOT, CREATEBOT} from '../../constants/api'
  import {REPLACE} from "../../store/mutations";
  import {request} from "../../serive/request";
  import store from '../../store/index'
  import {getCookies} from "../../utils/cookie";
  import {TOKEN} from "../../constants/constants";
  import {getList, reload} from "./service/requestMethod";
  import {STR} from "../../constants/constants";

  export default {
    data() {
      return {
        status: BOTLIST.status,
        resizable: false,
        keyWords: null,
      }
    },
    computed: {
      tableData() {
        return store.state.app.tableData
      },
      loading() {
        return store.state.app.loading
      },
      total() {
        return store.state.app.total
      },
      PageIndex() {
        return store.state.app.PageIndex
      }
    },
    components: {
      DrapDown,
    },
    created() {

      const reloadId = store.state.app.reloadId
      clearInterval(reloadId)

      store.dispatch(REPLACE, {tableData:[],total:0,PageIndex: 1, searchStatus: null, description: null}).then(
        () => {
          //1、获取列表
          getList(URL.requestHost + BOT, {}, ITEMKEY, true)
        }
      ).catch(err => err)
    },
    destroyed: function () {
      const id = store.state.app.reloadId
      clearInterval(id)
    },
    methods: {
      go(path, id, name) {
        sessionStorage.setItem('recordId', JSON.stringify(id));
        sessionStorage.setItem('name',  JSON.stringify(name));
        const url = {
          path: path,
          query: {
            recordId: id,
            name: name
          }
        }
        const arr = path.split('/')
        const index = STR[arr[arr.length - 1]]
        const config = this.$route.name === 'config';
        console.log("name",config)
        store.dispatch(REPLACE, {navIndex: index, config}).then(
          () => {
            this.$router.push(url)
          }
        )
      },
      renderProductId(h, {column}) {
        return h(DrapDown, {
            props: {
              options: BOTLIST.status,
            },
          }
        );
      },
      create(k, row) {
        this.$confirm('确认创建机器人？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.add(k, row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消创建'
          });
        });
      },
      add(k, row) {
        const that = this
        const token = getCookies(TOKEN)

        let obj = JSON.parse(JSON.stringify(row))
        let newObj = {...obj, Status: 1}
        const tableData = store.state.app.tableData
        tableData.splice(k, 1, newObj)
        store.dispatch(REPLACE, {tableData: tableData})

        const userInfo = store.state.app.userInfo
        const data = {
          botId: row.RecordId,
          alias: row.AliasName,
          description: row.Description,
          botType: row.BotType,
          deployModel: row.DeployModel,   //alone : share
          UserInfo: {
            Email: userInfo.Email,
            FullName: userInfo.FullName,
            TenantDomainName: userInfo.TenantDomainName
          }
        }
        const body = JSON.stringify(data)
        const options = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Token': token
          },
          body,
        }
        request(URL.requestHost + CREATEBOT, options).then(
          (res) => {
            that.$message({
              type: 'success',
              message: '创建中，请稍后',
              duration: 2000,
            });

            const newData = store.state.app.tableData
            reload(newData)
          }
        ).catch(
          (err) => {
            that.$message({
              type: 'error',
              message: '操作失败',
              duration: 2000
            });
            let obj = JSON.parse(JSON.stringify(row))
            let newObj = {...obj, Status: 6}
            const tableData = store.state.app.tableData
            tableData.splice(k, 1, newObj)
            store.dispatch(REPLACE, {tableData: tableData})
          }
        )
      },
      del(k, row) {
        this.$confirm('删除操作将永久删除机器人，是否继续?', '警告！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delItem(k, row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delItem(k, row) {
        const that = this

        let obj = JSON.parse(JSON.stringify(row))
        let newObj = {...obj, Status: 3}
        const tableData = store.state.app.tableData
        tableData.splice(k, 1, newObj)
        store.dispatch(REPLACE, {tableData: tableData})

        const userInfo = store.state.app.userInfo
        const data = {
          botId: row.RecordId,
          regName: row.AliasName,
          luisAppId: row.LuisAppId,
          botType: row.BotType,
          deployModel: row.DeployModel,   //alone : share
          UserInfo: {
            Email: userInfo.Email,
            FullName: userInfo.FullName,
            TenantDomainName: userInfo.TenantDomainName
          }
        }
        const body = JSON.stringify(data)
        const token = getCookies(TOKEN)
        const options = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Token': token
          },
          body,
        }
        request(URL.requestHost + DELETEBOT, options).then(
          (res) => {
            that.$message({
              type: 'success',
              message: '操作成功！'
            });

            const newData = store.state.app.tableData
            // const reloadId = store.state.app.reloadId
            // clearInterval(reloadId)

            reload(newData)

          }
        ).catch(
          (res) => {
            that.$message({
              type: 'error',
              message: '操作失败，请稍后再试！'
            });
          }
        )
      },
      handleCurrentChange(v) {
        store.dispatch(REPLACE, {PageIndex: v}).then(
          () => {
            const PageIndex = store.state.app.PageIndex
            const searchStatus = store.state.app.searchStatus
            const options = {
              body: {
                PageIndex: PageIndex,
                description: this.keyWords,
                searchStatus: searchStatus
              }
            }

            getList(URL.requestHost + BOT, options, ITEMKEY)
          }
        )
      },
      search() {
        const str ="<>%;/?'_"
        const index = this.keyWords&&str.indexOf(this.keyWords) > -1
        if(index){
          this.$message({
            type:'error',
            message:"请不要输入特殊字符作为关键词搜索，例如 <，>，%，;，/，?，'，_等",
            duration:2000,
          })
          return
        }
        const description = this.keyWords
        const searchStatus = store.state.app.searchStatus
        store.dispatch(REPLACE, {PageIndex: 1, description}).then(
          () => {
            const options = {
              body: {
                description,
                searchStatus,
              }
            }

            getList(URL.requestHost + BOT, options, ITEMKEY)
          }
        )
      },

    }
  }
</script>
<style lang="scss" scoped>
  @import '../../style/index';

  .search {
    width: 360px;
    height: 32px;
  }


  /*
  size
   */
  .margin-top20 {
    margin-top: 20px;
  }
  .yoy-list-todo {
    span {
      cursor: pointer;
    }
    a {
      text-underline: none;
    }
  }

  .create:hover {
    a, i, span {
      color: $primary-color;
    }
  }

  .del {
    margin-left: 14px;
  }

  .del:hover {
    a, i, span {
      color: $danger;
    }
  }

  .config:hover {
    a, i, span {
      color: $primary-color;
    }
  }

  .wait {
    opacity: .6;
  }

  .rotate360 {
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 1s;
    -moz-transition-property: -moz-transform;
    -moz-transition-duration: 1s;
    -webkit-animation: rotate 3s linear infinite;
    -moz-animation: rotate 3s linear infinite;
    -o-animation: rotate 3s linear infinite;
    animation: rotate 3s linear infinite;
  }

  @-webkit-keyframes rotate {
    from {
      -webkit-transform: rotate(0deg)
    }
    to {
      -webkit-transform: rotate(360deg)
    }
  }

  @-moz-keyframes rotate {
    from {
      -moz-transform: rotate(0deg)
    }
    to {
      -moz-transform: rotate(359deg)
    }
  }

  @-o-keyframes rotate {
    from {
      -o-transform: rotate(0deg)
    }
    to {
      -o-transform: rotate(359deg)
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(359deg)
    }
  }
</style>
