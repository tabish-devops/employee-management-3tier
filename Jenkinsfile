
pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/tabish-devops/employee-management-3tier.git'
            }
        }

        stage('Check Project Files') {
            steps {
                sh '''
                    test -f frontend/package.json
                    test -f backend/package.json
                    test -f frontend/Dockerfile
                    test -f backend/Dockerfile
                    echo "Project files verified"
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Check Backend') {
            steps {
                dir('backend') {
                    sh '''
                        npm ci
                        node --check server.js
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t employee-frontend:latest ./frontend
                    docker build -t employee-backend:latest ./backend
                '''
            }
        }
    }

    post {
        success {
            echo 'CI pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
