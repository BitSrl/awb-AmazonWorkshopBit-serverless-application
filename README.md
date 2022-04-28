# awb-AmazonWorkshopBit-serverless-application
This repository contains all the code needed to deploy a fullstack serverless application

Applications:
- Lambda + API Gateway + DynamoDB
- Angular


Backend Lambda Build:
1) npm install
2) npm run-script build
3) npm prune --no-audit --progress=false --production
4) mv node_modules dist
5) archive into dist.zip file
6) s3 sync with your bucket
7) deploy with your cloudformation template

Frontend Build:
1) npm install
2) update / create env files
3) npm run-script build
4) manually upload dist folder to s3 