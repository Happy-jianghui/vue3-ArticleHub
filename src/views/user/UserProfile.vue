<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

// 表单引用
const userFormRef = ref()
// 是在使用仓库中数据的初始值（无需响应式） 结构无问题
const {
  user: { id, username, nickname, email },
  getUser
} = useUserStore()

// 表单数据
const userForm = ref({
  username,
  nickname,
  email,
  id
})

// 校验规则
const rules = {
  // 昵称校验：2-10位非空字符串
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称长度需为2-10个非空字符 ',
      trigger: 'blur'
    }
  ],
  // 邮箱校验：符合邮箱格式
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
}

// 提交表单
const submitForm = async () => {
  // 等待校验结果
  await userFormRef.value.validate()
  // 提交修改
  await userUpdateInfoService(userForm.value)
  // 通知 user 模块，进行数据的更新
  getUser()
  // 提示用户
  ElMessage.success('修改成功')
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <!-- 表单 -->
    <el-form
      :model="userForm"
      :rules="rules"
      ref="userFormRef"
      label-width="100px"
      style="width: 50%"
    >
      <!-- 登录名称（禁用状态） -->
      <el-form-item label="登录名称">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>

      <!-- 用户昵称 -->
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="userForm.nickname"
          placeholder="请输入用户昵称"
        ></el-input>
      </el-form-item>

      <!-- 用户邮箱 -->
      <el-form-item label="用户邮箱" prop="email">
        <el-input
          v-model="userForm.email"
          placeholder="请输入用户邮箱"
        ></el-input>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
