#!/bin/bash

cat > node-controller.yml <<EOF
apiVersion: v1
kind: ReplicationController
metadata:
  name: node
  labels:
    name: node
spec:
  replicas: 1
  selector:
    name: node
  template:
    metadata:
      labels:
        name: node
        deployment: "${WERCKER_GIT_COMMIT}"
    spec:
      containers:
        - image: "gcr.io/${GCR_PROJECT}/${GCR_IMAGE}:${WERCKER_GIT_COMMIT}"
          name: node
          imagePullPolicy: Always
          ports:
            - containerPort: 80
EOF