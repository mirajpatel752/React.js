#!/bin/bash
#cd /home/ubuntu
AWS_ACCOUNT_ID="313087159864"
AWS_DEFAULT_REGION="ap-south-1"
IMAGE_REPO_NAME="munim_react"
IMAGE_TAG="latest"
REPOSITORY_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
echo 'aws ecr calling========================================>'
aws ecr get-login-password --region ap-south-1 | sudo docker login --username AWS --password-stdin 313087159864.dkr.ecr.ap-south-1.amazonaws.com
docker build -t munim_react .
docker tag munim_react:latest 313087159864.dkr.ecr.ap-south-1.amazonaws.com/munim_react:latest
docker push 313087159864.dkr.ecr.ap-south-1.amazonaws.com/munim_react:latest
cd /home/ubuntu/kubernetes_settings/reactjs
kubectl apply -f deployment.yaml
kubectl patch deployment react-app -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
# docker rmi $( docker images | grep none | tr -s ' ' | cut -d ' ' -f 3)