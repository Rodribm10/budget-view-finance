
// N8N Workflow Template
// Este template será modificado dinamicamente para cada usuário

export const N8N_WORKFLOW_TEMPLATE = {
  "name": "Finance Workflow - rodrigobm10@gmail.com",
  "nodes": [
    {
      "parameters": {
        "path": "rodrigobm10",
        "options": {}
      },
      "id": "e0b5fd6c-3a8d-4b24-940f-2a8d51e2b6e7",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        320,
        300
      ],
      "webhookId": "69b63b02-5b8e-46dd-8f9f-e7ffe5d6a2bc"
    },
    {
      "parameters": {
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "supabaseApi",
        "requestMethod": "POST",
        "url": "https://tnurlgbvfsxwqgwxamni.supabase.co/rest/v1/conversas_zap",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Prefer",
              "value": "return=minimal"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "login",
              "value": "rodrigobm10@gmail.com"
            },
            {
              "name": "msg_recebida",
              "value": "={{ $json.body.message.conversation }}"
            },
            {
              "name": "remote_jid",
              "value": "={{ $json.body.key.remoteJid }}"
            },
            {
              "name": "date_time",
              "value": "={{ new Date($json.body.messageTimestamp * 1000).toISOString() }}"
            },
            {
              "name": "status_processamento",
              "value": "recebida"
            }
          ]
        },
        "options": {}
      },
      "id": "982f8e5b-1c9e-4a2f-8d5f-3b7e9c4a6f1d",
      "name": "Salvar Conversa no Supabase",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        540,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "8f2e4a1d-6b3c-4e5f-9a7b-2c8d5e6f4a9b",
              "leftValue": "={{ $json.body.key.remoteJid }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "contains",
                "rightType": "any"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "name": "Verificar se é Grupo",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        760,
        300
      ]
    },
    {
      "parameters": {
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "supabaseApi",
        "requestMethod": "POST",
        "url": "https://tnurlgbvfsxwqgwxamni.supabase.co/rest/v1/rpc/processar_mensagem_financeira",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "p_login",
              "value": "rodrigobm10@gmail.com"
            },
            {
              "name": "p_mensagem",
              "value": "={{ $json.body.message.conversation }}"
            },
            {
              "name": "p_remote_jid",
              "value": "={{ $json.body.key.remoteJid }}"
            }
          ]
        },
        "options": {}
      },
      "id": "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
      "name": "Processar Mensagem Financeira",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        980,
        300
      ]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Salvar Conversa no Supabase",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Salvar Conversa no Supabase": {
      "main": [
        [
          {
            "node": "Verificar se é Grupo",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Verificar se é Grupo": {
      "main": [
        [
          {
            "node": "Processar Mensagem Financeira",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
};
