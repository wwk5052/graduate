<template>
  <div>
    <h1>后端管理员系统</h1>
    <Form
      ref="formCustom"
      :model="formCustom"
      :rules="ruleCustom"
      :label-width="80"
    >
      <FormItem label="Username" prop="username">
        <Input type="text" v-model="formCustom.username" number />
      </FormItem>
      <FormItem label="Password" prop="password">
        <Input type="password" v-model="formCustom.password" />
      </FormItem>
      <!-- <FormItem label="Confirm" prop="passwdCheck">
      <Input type="password" v-model="formCustom.passwordCheck" />
      </FormItem>-->

      <FormItem>
        <Button type="primary" @click="handleSubmit('formCustom')"
          >Submit</Button
        >
        <Button @click="register" style="margin-left: 8px">Register</Button>
      </FormItem>
    </Form>
    <!-- register -->
    <Modal
      v-model="registerModalSwitch"
      title="Regisiter User"
      footer-hide
      :mask-closable="false"
    >
      <Form
        ref="formCustomRegister"
        :model="formCustomRegister"
        :rules="regCustom"
        :label-width="80"
      >
        <FormItem label="Username" prop="username">
          <Input type="text" v-model="formCustomRegister.username" number />
        </FormItem>
        <FormItem label="Password" prop="password">
          <Input type="password" v-model="formCustomRegister.password" />
        </FormItem>
        <FormItem label="Confirm" prop="passwordCheck">
          <Input type="password" v-model="formCustomRegister.passwordCheck" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleReg('formCustomRegister')"
            >Register</Button
          >
          <Button @click="cancelReg" style="margin-left: 8px">Cancel</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Password cannot be empty'));
      }
      // if (value === '') {
      //   callback(new Error('Please enter your password'));
      // } else {
      //   if (this.formCustom.passwdCheck !== '') {
      //     // 对第二个密码框单独验证
      //     this.$refs.formCustom.validateField('passwdCheck');
      //   }
      //   callback();
      // }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('The two input passwords do not match!'));
      } else {
        callback();
      }
    };
    const validateAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Username cannot be empty'));
      }
      // 模拟异步验证效果
      // setTimeout(() => {
      //   if (!Number.isInteger(value)) {
      //     callback(new Error('Please enter a numeric value'));
      //   } else {
      //     if (value < 18) {
      //       callback(new Error('Must be over 18 years of age'));
      //     } else {
      //       callback();
      //     }
      //   }
      // }, 1000);
    };
    const regValiUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Username cannot be empty'));
      }
    };
    const regValiPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Password cannot be empty'));
      }
      // if (value === '') {
      //   callback(new Error('Please enter your password'));
      // } else {
      //   if (this.formCustom.passwdCheck !== '') {
      //     // 对第二个密码框单独验证
      //     this.$refs.formCustom.validateField('passwdCheck');
      //   }
      //   callback();
      // }
    };
    const regValiPassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'));
      } else if (value !== this.formCustomRegister.password) {
        callback(new Error('The two input passwords do not match!'));
      } else {
        callback();
      }
    };
    return {
      registerModalSwitch: false,
      formCustom: {
        username: '',
        password: '',
        passwordCheck: ''
      },
      formCustomRegister: {
        username: '',
        password: '',
        passwordCheck: ''
      },
      ruleCustom: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        passwordCheck: [{ validator: validatePassCheck, trigger: 'blur' }],
        username: [{ validator: validateAge, trigger: 'blur' }]
      },
      regCustom: {
        password: [{ validator: regValiPass, trigger: 'blur' }],
        passwordCheck: [{ validator: regValiPassCheck, trigger: 'blur' }],
        username: [{ validator: regValiUsername, trigger: 'blur' }]
      }
    };
  },
  computed: {
    // isAdmin: () => this.$store.getters.userLogin,
    isAdmin: function() {
      return this.$store.getters.userLogin;
    }
  },
  methods: {
    handleSubmit(name) {
      // this.$refs[name].validate((valid) => {
      //   if (valid) {
      //     this.$Message.success('Success!');
      //   } else {
      //     this.$Message.error('Fail!');
      //   }
      // });
      console.log(this.formCustom);
      this.$axios
        .post(`/baseUrl/api/user/login`, this.formCustom)
        .then(res => {
          const resData = res.data;
          console.log(resData);
          if (resData.errno === 0) {
            this.formCustom = {};
            this.$Message.success('登录成功！');
            this.$router.push({ path: '/detail/products' });
            localStorage.setItem('loginStatus', true);
            // this.$store.dispatch('userLoginStatus', true);
          } else {
            this.$Message.error('用户名或密码错误！');
          }
        })
        .catch(err => {
          this.$Message.error('登录失败');
          console.log('登录失败', err);
        });
    },
    handleReg() {
      console.log(this.formCustomRegister);
      this.$axios
        .post(`/baseUrl/api/user/reg`, this.formCustomRegister)
        .then(res => {
          const resData = res.data;
          console.log(resData);
          if (resData.errno === 0) {
            this.formCustomRegister = {};
            this.$Message.success('注册成功!');
            // this.$router.push({ path: '/detail/products' });
            localStorage.setItem('loginStatus', true);
            // this.$store.dispatch('userLoginStatus', true);
          } else {
            this.$Message.error('用户名重复！');
          }
          this.registerModalSwitch = false;
        })
        .catch(err => {
          this.$Message.error('注册失败');
          console.log('注册失败', err);
        });
    },
    register() {
      this.registerModalSwitch = true;
    },
    cancelReg() {
      this.registerModalSwitch = false;
    },

    //reset
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
