<template>
    <section class="container">
        <article class="repo">
            <div class="repo-header between">
                <h1>{{ repoContent.data.full_name }}</h1>
                <p>created at {{ repoContent.data.created_at }}</p>
            </div>
            <div class="repo-main between">
                <p>{{ repoContent.data.description }}</p>
                <p>Stars: {{ repoContent.data.stargazers_count }}</p>
            </div>
            <div class="repo-bottom between">
                <a :href="repoContent.data.html_url" class="noneDecoration">{{ repoContent.data.html_url }}</a>
                <p>updated at {{ repoContent.data.updated_at }}</p>
            </div>
        </article>
    </section>
</template>

<script>
import { reactive, toRef } from 'vue'

async function getRepos(username, reponame) {
    console.log("username", username, reponame.value);
    const response = await fetch(`https://api.github.com/repos/${username}/${reponame.value}`)
    const repoData = await response.json();
    console.log("Data", repoData);
    return repoData
}

export default {
    props: ['username','reponame'],
    setup(props) {
        const repoName = toRef(props, 'reponame');
        let repoContent = reactive({data: {}});
        getRepos(props.username, repoName).then((res) => repoContent.data = res);
        return {
            repoContent
        }
    },
}
</script>

<style scoped>
.container {
  min-width: 978px;
  height: auto;
  margin: 3vh auto;
  color: #cfd0d1;
  width: 70%;
  border: 0.01px solid rgba(255,255,255,0.2);
  border-radius: 5px;
}
.repo {
    width: 95%;
    padding: 10px 25px 20px 25px;
    text-align: left;
}
.between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.repo-header {
    border-bottom: 0.01px solid rgba(255,255,255,0.2);
    margin: 5px 0;
}
.repo-bottom > a,
.repo-bottom > a:visited {
    color: #58a6ff;
}
.noneDecoration {
    text-decoration: none;
}
.repo-bottom {
    align-items: center;
}

@media screen and (max-width: 1011px) {
    .container {
        min-width: 90%;
        margin: 2vh auto;
    }
    .repo {
        width: 95%;
        padding: 10px 15px;
    }
    .between {
        flex-direction: column;
        align-items: flex-start;
    }
    .repo-bottom > a {
        word-break: break-all;
    }
}
</style>