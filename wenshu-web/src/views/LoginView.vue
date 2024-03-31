<template>
    <van-config-provider>
        <van-nav-bar title="登录" left-arrow left-text="返回" @click-left="goBack"></van-nav-bar>
        <van-form @submit="onSubmit" style="margin-top: 1rem;">
            <van-cell-group inset>
                <van-field v-model="username" name="username" label="手机号码" placeholder="手机号码"
                    :rules="[{ usernameValidator, required: true, message: '请填写用户名' }]">
                    <template #label>
                        <div @click="countrySelectShow = true">
                            <label for="">{{ phoneCode }}</label>
                            <van-icon name="arrow-down" style="padding-left: 4px;"></van-icon>
                        </div>
                        <van-popup position="bottom" :show="countrySelectShow">
                            <van-picker title=" " :columns="phonecode2country" @confirm="confirmCountry"
                                @cancel="countrySelectShow = false" />
                        </van-popup>
                    </template>
                </van-field>
                <van-field v-model="password" type="password" name="password" label="密码" placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-checkbox v-model="remember">记住密码</van-checkbox>
            </div>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit" :disabled="submitDisable"
                    class="van-haptics-feedback">
                    <van-loading v-if="submitDisable" color="white">{{ loadingText }}</van-loading>
                    <span v-else>提交</span>
                </van-button>
            </div>
        </van-form>
        <van-cell-group inset class="question">
            <van-cell title="我没有账号怎么办？" label="请登录文书网（wenshu.court.gov.cn）账号，没有可先前往官网注册。"></van-cell>
        </van-cell-group>
    </van-config-provider>
</template>

<script setup>
import { ref } from 'vue';
import { phonecode2country } from '@/utils/country_phone_code';
import { currentUser, decryptPwdAes, encryptPwd, encryptPwdAes, login } from '@/utils/bussiness';
import { random, uuid } from '@/utils/wenshu_raw';

const countrySelectShow = ref(false)
const cachedCountryCode = localStorage.getItem("countryCode")
const phoneCode = ref(cachedCountryCode ? cachedCountryCode : "+86")
const confirmCountry = ({ selectedOptions }) => {
    countrySelectShow.value = false
    phoneCode.value = selectedOptions[0].value
}
const username = ref(localStorage.getItem("username"))
const usernameValidator = (val) => /\d+/.test(val)

const cachedPwd = localStorage.getItem("password")
const password = ref(cachedPwd ? decryptPwdAes(cachedPwd, username.value) : "")
const remember = ref(true)
const goBack = () => { history.back() }

const submitDisable = ref(false)
const loadingText = ref('')
const pageId = uuid()
const requestToken = random()
const onSubmit = async ({ username, password }) => {
    if (phoneCode.value !== "+86") {
        username = `${phoneCode.value.slice(1)}-${username}`
    }
    console.log(username, password)
    submitDisable.value = true
    loadingText.value = "登录中..."
    try {
        const encryptedPwd = encryptPwd(password)
        let lr = await login({ username, password: encryptedPwd })
        if (lr.code !== 0) {
            console.log(`[login fail] code;${lr.code}, success:${lr.success}, msg:${lr.msg}`)
            submitDisable.value = false
            return
        }
        // 登录完成，检查一下 currentUser
        let { code, success, msg } = await currentUser({ pageId, requestToken, extra: {} })
        if (code !== 1 || !success) {
            console.log(`[currentUser fail] code;${code}, success:${success}, msg:${msg}`)
            submitDisable.value = false
            return
        }
        loadingText.value = "登录成功，即将跳转..."
        if (remember.value) {
            // 存储账号密码
            localStorage.setItem("countryCode", phoneCode.value)
            localStorage.setItem("username", username)
            localStorage.setItem("password", encryptPwdAes(password, username))
        }

        setTimeout(() => { history.back() }, 2000)

    } catch (err) {
        console.error(err)
        submitDisable.value = false
    }
}

</script>

<style lang="less" scoped>
.question>* {
    background-color: var(--root-background-color);
}
</style>