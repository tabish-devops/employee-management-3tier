
pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'mullani'
        FRONTEND_IMAGE = 'mullani/employee-management-frontend'
        BACKEND_IMAGE  = 'mullani/employee-management-backend'
    }

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
                    docker build -t $FRONTEND_IMAGE:latest ./frontend
                    docker build -t $BACKEND_IMAGE:latest ./backend
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_TOKEN'
                )]) {
                    sh '''
                        set +x
                        echo "$DH_TOKEN" | docker login \
                            -u "$DH_USER" --password-stdin

                        docker push $FRONTEND_IMAGE:latest
                        docker push $BACKEND_IMAGE:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Test EC2 SSH') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        ssh -i "$SSH_KEY" \
                            -o StrictHostKeyChecking=accept-new \
                            -o ConnectTimeout=10 \
                            "$SSH_USER@13.201.134.22" \
                            "echo EC2 SSH connection successful"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI pipeline, Docker Hub push and EC2 SSH test completed!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
