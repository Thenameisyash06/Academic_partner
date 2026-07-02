pipeline{
    agent any

    environment{
        VERCEL_TOKEN = credentials("vercel_token")
    }

    stages{
        stage('install'){
            bat 'npm install'
        }
        stage('build'){
            bat 'npm run start'
            echo 'building...'
        }
        stage('test'){
            echo 'testing...'
        }
        stage('deploy'){
            bat 'npx vercel --prod --yes --token=%VERCEL_TOKEN%'
            echo 'deploying...'
        }
    }
}
