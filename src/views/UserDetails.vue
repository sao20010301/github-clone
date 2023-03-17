<template>
  <section class="container">
    <div class="repo-owner">
      <div class="repo-owner-container">
        <img class="repo-owner-img" :src="repos.items[0]?.owner.avatar_url" alt="ownerImg">
        <h1 class="repo-owner-name">{{ repos.items[0]?.owner?.login }}</h1>
      </div>
    </div>
    <div class="repos">
      <div class="repo" v-for="(repo, index) in repos.items" :key="index">
        <h3 class="repo-title">
          <router-link :to="{ name: 'userrepo', params: { username: repo?.owner?.login, reponame: repo?.name }}">{{ repo?.name }}</router-link>
          <span class="repo-status">{{ repo?.private ? "Private" : "Public"}}</span>
        </h3>
        <p>{{ repo?.description }}</p>
        <div class="repo-details">
          <p>{{ repo?.language }}</p>
          <p v-if="repo?.license">License: {{ repo?.license?.spdx_id }}</p>
          <p>Forks: {{ repo?.forks_count }}</p>
          <p>Stars: {{ repo?.stargazers_count }}</p>
          <p>Issues: {{ repo?.open_issues_count }}</p>
          <p>Updated on {{ repo?.updated_at }}</p>
        </div>
      </div>
    </div>
    <div v-show="isLoading" class="loading">
        <div class="spinner"></div>
      </div>
    <div class="bottom" ref="ob"></div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { onActivated, reactive, watch } from '@vue/runtime-core';
import router from '../router'

async function getUser(searchUser) {
        const response = await fetch(`https://api.github.com/users/${searchUser}`);
        const userData = await response.json();
        sessionStorage.setItem("repoAmount", userData.public_repos);
        if (userData.message == 'Not Found') {
          router.push({ path: '/NotFound', replace: true })
        } else {
          return getRepos(searchUser);
        }
    }

async function getRepos(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos?page=1&per_page=10`)
      const repoData = await response.json();
      return repoData
    }

export default {
  name: "UserDetails",
  props: {
    username: String,
  },
  async setup(props) {
    const ob = ref(null)
    let isLoading = ref(true);
    let page = 1;
    onActivated(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const repoAmount = sessionStorage.getItem("repoAmount");
            if(10*page >= repoAmount) {
              isLoading.value = false;
            }
            if(entry.isIntersecting && 10*page < repoAmount) {
              const loadMore = async () => {
                const response = await fetch(`https://api.github.com/users/${props.username}/repos?page=${page}&per_page=10`);
                page+=1;
                const resData = await response.json();
                repos.items = repos.items.concat(resData);
              };
              loadMore(props.username);
            }
          });
        }, {root: null, rootMargin: '0px', threshold: 0})
        observer.observe(ob.value);
    })

    let repos = reactive({items:[]});
    repos.items = await getRepos(props.username);

    watch(
      () => props.username,
      () => {
        getUser(props.username).then((res) => {
          repos.items = res;
        });
      },
    )

    return {
      repos,
      ob,
      isLoading,
    }
  },
  beforeRouteEnter(to) {
    getUser(to.params.username);
  },
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5vh;
}
.repo-owner {
  height: 70px;
  width: 70%;
  min-width: 978px;
  border-bottom: 0.01px solid rgba(255,255,255,0.2);
  margin: 0 auto 10px auto;
}
.repo-owner-img {
  height: 30px;
  width: 30px;
  border-radius: 6px;
}
.repo-owner-container {
  height: 100%;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
}
.repo-owner-container > h1 {
  margin-left: 10px;
  color: #c9d1d9;
}
.repos {
  min-width: 978px;
  margin: 0 auto;
  color: #cfd0d1;
  width: 70%;
  border: 0.01px solid rgba(255,255,255,0.2);
  border-radius: 5px;
}
.repo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  border-bottom: 0.01px solid rgba(255,255,255,0.2);
}
.repo p {
  margin: 0;
}
.repo-title {
  display: flex;
  align-items: center;
  margin: 0;
}
.repo-title a {
  font-size: 20px;
  color: #58a6ff;
  text-decoration: none;
}
.repo-title a:visited {
  color: #58a6ff;
}
.repo-title a:hover {
  text-decoration: underline;
}
.repo-status {
  margin-left: 10px !important;
  border: 0.01px solid rgba(255,255,255,0.2);
  border-radius: 15px;
  font-size: 12px;
  padding: 0 7px;
}
.repo-details {
  margin-top: 5px;
  display: flex;
  justify-content: space-evenly;
}
.repo-details p {
  font-size: 14px;
  margin-right: 15px;
}
.loading {
  margin: 0 auto;
  height: 60px;
  width: 60px;
  display: flex;
  justify-content: center;
}
.loading .spinner {
  height: 100%;
  width: 100%;
  border: 10px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spinning 0.7s linear infinite;
}
@keyframes spinning {
  0% { transform: rotate(0deg) }
  25% { transform: rotate(90deg) }
  50% { transform: rotate(180deg) }
  75% { transform: rotate(270deg) }
  100% { transform: rotate(360deg) }
}
@media screen and (max-width: 1011px){
  .container {
    width: 95%;
    margin: 2vh auto;
  }
  .repo-owner,
  .repos {
    min-width: 100%;
  }
  .repo > p {
    text-align: left;
    font-size: 14px;
  }
  .repo-details {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>