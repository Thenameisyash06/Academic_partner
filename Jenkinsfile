pipeline{
    agent any

    environment{
        VERCEL_TOKEN = credentials("vercel_token")
    }

    stages{
        stage('install'){
            steps{
            bat 'npm install'
            }
        }
        stage('build'){
            steps{
            bat 'npm run start'
            echo 'building...'
            }
        }
        stage('test'){
            steps{
            echo 'testing...'
            }
        }
        stage('deploy'){
            steps{
            bat 'npx vercel --prod --yes --token=%VERCEL_TOKEN%'
            echo 'deploying...'
            }
        }
    }
}
