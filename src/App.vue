<template>
<div id="main">
  <nav>
  <router-link class="home-link" :to="{name: 'home', replace: true, params: {username: '1'}}">Home</router-link>
  <input type="text" v-model="user" @keyup.enter="GoToPage(user)">
</nav>
  <Suspense>
    <router-view v-slot="{Component}">
      <keep-alive include="UserDetails" exclude="HomeView">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </Suspense>
</div>
</template>

<script>
import { ref } from 'vue'
import router from './router'

export default {
  setup() {
    let user = ref('');
    function GoToPage(searchUser) {
      console.log("Go to page");
      router.push({ name: "userpage", replace: true, params: {username: searchUser}});
    }
    return {
      user,
      GoToPage
    }
  },
}
</script>

<style>
html {
  height: 100%;
  background-color: #0E1116;
}
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  background-color: #0E1116;
}

nav {
  display: flex;
  justify-content: first baseline;
  align-items: center;
  background-color: #171B21;
  text-decoration: none;
  color: #F1F6FB;
  height: 7vh;
  padding: 16px 24px;
}

.home-link {
  text-decoration: none;
  margin-right: 16px;
}

.home-link:visited {
  color: inherit; 
}

nav > input[type='text'] {
    color: #CAD1D8;
    background-color: #0E1116;
    border: 1px solid #45484C;
    border-radius: 6px;
    height: 50%;
    width: 20%;
    transition: 0.2s ease;
  }

nav > input[type='text']:focus {
    outline: none;
    background-color: #171B21;
    width: 40%;
  }
@media screen and (max-width: 768px) {
  nav {
    width: 95%;
    padding: 5px 10px;
  }
  nav > input[type="text"] {
    width: 50%;
  }
  nav > input[type="text"]:focus {
    width: 70%;
  }
}
</style>
