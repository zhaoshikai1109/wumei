<template>
  <div class="error">
    <el-empty description="页面走丢了~">
      <el-button type="primary" size="small" @click="$router.push('/')"
        >回到首页</el-button
      >
    </el-empty>
  </div>
</template>

<script>
export default {
  name: "Error",
};
</script>

<style lang="less" scoped>

</style>