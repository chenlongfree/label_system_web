<template>
  <div class="app-container">
    <el-form ref="form" :model="info" label-width="120px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="标签体系名称">
            <el-input v-model="info.name" placeholder="请输入内容" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-button class="filter-item" style="margin-bottom: 3px;" type="primary" size="mini" icon="el-icon-edit" @click="handleCreate">新增</el-button>
      <el-table
        :data="info.nodes"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="id" label="主键" />
        <el-table-column prop="pid" label="父主键" />
        <el-table-column prop="name" label="标签名称" />
        <el-table-column prop="modelId" label="模型ID" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-button type="primary" @click="commit">提交</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="node" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="父标签">
          <treeselect v-model="node.pid" :options="options" />
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="node.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { map } from '@/api/dict'
import { get, tree } from '@/api/label/hierarchy'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  data() {
    return {
      id: undefined,
      listLoading: true,
      info: {
        name: undefined,
        nodes: []
      },
      dict: {
        auditState: {},
        status: {}
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      node: {
        id: undefined,
        pid: undefined,
        name: undefined,
        model_id: undefined,
        model_param_id: undefined,
        create_time: undefined,
        update_time: undefined
      },
      options: [],
      selectData: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.init()

    this.id = this.$route.params && this.$route.params.id
    if (this.id !== undefined && this.id != null) {
      this.get(this.id)
    }
  },
  methods: {
    init() {
      map('SHZT').then(res => {
        this.dict.auditState = res.data
      })
      map('JLZT').then(res => {
        this.dict.status = res.data
      })
    },
    get(id) {
      get(id).then(res => {
        this.info = res.data
      })
    },
    treeNode() {
      tree(this.id).then(res => {
        this.options = res.data
      })
    },
    resetNodeData() {
      this.node = {
        id: undefined,
        pid: undefined,
        name: undefined,
        model_id: undefined,
        model_param_id: undefined,
        create_time: undefined,
        update_time: undefined
      }
    },
    handleCreate() {
      this.treeNode()
      this.resetNodeData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        // if (valid) { }
      })
    },
    handleUpdate(row) {
      this.treeNode()
      this.node = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    commit() { }
  }
}
</script>
