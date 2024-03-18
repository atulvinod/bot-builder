#!/bin/bash
while getopts c:e:u: flag
do
    case "${flag}" in
        c) chat_v=${OPTARG};;
        e) embed_v=${OPTARG};;
        u) upload_v=${OPTARG};;
    esac
done


if [ ! -z ${chat_v+x} ];then 
    echo "updating chat service to: $chat_v";
    docker service update --image atulvinod1911/botbuilder-chat-service:$chat_v prod_chat-service
fi

if [ ! -z ${embed_v+x} ];then 
    echo "updating embed service to: $embed_v";
    docker service update --image atulvinod1911/botbuilder-embed-service:$embed_v prod_embed-service
fi

if [ ! -z ${upload_v+x} ];then 
    echo "updating upload service to: $upload_v";
    docker service update --image atulvinod1911/botbuilder-chat-service:$upload_v prod_upload-service
fi

