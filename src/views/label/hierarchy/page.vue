<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="queryForm" :model="queryForm" label-width="120px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="标签体系名称">
              <el-input v-model="queryForm.name" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select v-model="queryForm.auditState" clearable placeholder="请选择">
                <el-option
                  v-for="item in options.auditState"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="page">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <span>{{ dict.auditState[scope.row.auditState] || scope.row.auditState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="scope">
          {{ scope.row.createdBy }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="记录状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ dict.status[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link v-if="row.auditState === 9" :to="'/label/hierarchy/form/'+row.id">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button v-if="row.auditState === 0" size="mini" type="success" @click="handleModifyStatus(row,'published')">审核</el-button>
          <el-button v-if="row.auditState !== 1" size="mini" type="danger" @click="handleDelete(row,$index)">删除</el-button>
          <el-button size="mini" @click="handleModifyStatus(row,'draft')">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="count>0" :total="count" :page.sync="queryForm.page" :limit.sync="queryForm.limit" @pagination="page" />
  </div>
</template>

<script>
import { page } from '@/api/label/hierarchy'
import { tree, map } from '@/api/dict'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'gray',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      list: null,
      count: 0,
      queryForm: {
        page: 1,
        limit: 20,
        name: undefined,
        auditState: undefined,
        status: undefined,
        sort: '+id'
      },
      options: {
        auditState: []
      },
      dict: {
        auditState: {},
        status: {}
      }
    }
  },
  created() {
    this.init()
    this.page()
  },
  methods: {
    init() {
      tree('SHZT').then(res => {
        this.options.auditState = res.data
      })
      map('SHZT').then(res => {
        this.dict.auditState = res.data
      })
      map('JLZT').then(res => {
        this.dict.status = res.data
      })
    },
    page() {
      this.listLoading = true
      page(this.queryForm).then(res => {
        this.list = res.data
        this.count = res.count
        this.listLoading = false
      })
    }
  }
}
</script>
