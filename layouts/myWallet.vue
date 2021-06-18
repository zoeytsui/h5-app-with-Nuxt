<template>
    <div id="layout">
        <TopBar />
        <TotalBalance />
        <Nuxt />
    </div>
</template>

<style>
html {
    font-family: "Helvetica Neue", Arial, sans-serif, -apple-system,
        BlinkMacSystemFont, "Source Sans Pro", "Segoe UI", Roboto;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
}

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
}

#layout {
    background: url("~assets/Rectangle.png") no-repeat center;
    background-attachment: fixed;
    background-size: cover;
    height: 100vh;
    width: 100%;
}

.button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
}

.button--green:hover {
    color: #fff;
    background-color: #3b8070;
}

.button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
}

.button--grey:hover {
    color: #fff;
    background-color: #35495e;
}
</style>
