<template>
  <div>
    <b-navbar sticky type="dark" variant="success">
      <b-navbar-brand><b-icon icon="emoji-smile-fill" animation="cylon"></b-icon>&nbsp;&nbsp;&nbsp;Board Project</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="/">Home</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav>
       <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit"><b-icon icon="search"></b-icon></b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
    
}
</script>

<style>

</style>