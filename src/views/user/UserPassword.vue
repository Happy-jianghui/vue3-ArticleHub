<script setup>
import { ref } from 'vue'
import { userUpdatePwdService } from '@/api/user'
import { useUserStore } from '@/stores'
// 导入路由
import { useRouter } from 'vue-router'

// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 表单引用
const pwdFormRef = ref(null)

// 校验规则
const rules = {
  // 校验 原密码
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { pattern: /^.{6,15}$/, message: '密码长度需为6-15位', trigger: 'blur' },
    { validator: validateOldNewPwd, trigger: 'blur' } // 自定义校验1
  ],
  // 校验 新密码
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { pattern: /^.{6,15}$/, message: '密码长度需为6-15位', trigger: 'blur' },
    { validator: validateOldNewPwd, trigger: 'blur' }
  ],
  // 校验 确认密码
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { pattern: /^.{6,15}$/, message: '密码长度需为6-15位', trigger: 'blur' },
    { validator: validateRePwd, trigger: 'blur' } // 自定义校验2
  ]
}

// 自定义校验1：原密码 和 新密码不能一样
function validateOldNewPwd(rule, value, callback) {
  if (
    pwdForm.value.old_pwd &&
    pwdForm.value.new_pwd &&
    pwdForm.value.old_pwd === pwdForm.value.new_pwd
  ) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

// 自定义校验2：新密码 和 确认密码必须一样
function validateRePwd(rule, value, callback) {
  if (
    pwdForm.value.new_pwd &&
    pwdForm.value.re_pwd &&
    pwdForm.value.new_pwd !== pwdForm.value.re_pwd
  ) {
    callback(new Error('确认密码与新密码不一致'))
  } else {
    callback()
  }
}
const userStore = useUserStore()
const router = useRouter()
// 提交表单
const submitForm = async () => {
  await pwdFormRef.value.validate()
  await userUpdatePwdService(pwdForm.value)
  ElMessage.success('修改密码成功')

  // 密码修改成功后，退出重新登录
  // 1. 清除token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})

  // 拦截登录
  router.push('/login')
}

// 重置表单
const resetForm = () => {
  pwdFormRef.value.resetFields()
}
</script>
<template>
  <page-container title="修改密码">
    <el-form
      :model="pwdForm"
      :rules="rules"
      ref="pwdFormRef"
      label-width="100px"
      style="width: 50%"
    >
      <!-- 原密码 -->
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          placeholder="请输入原密码"
        ></el-input>
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          placeholder="请输入新密码"
        ></el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          placeholder="请确认新密码"
        ></el-input>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style scoped>
.box-card {
  margin-top: 20px;
}
</style>
