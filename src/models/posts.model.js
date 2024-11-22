import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js"; // no node precisa colocar o .js

let conexao;
async function obterConexao() {
  if (!conexao) {
    conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
  }
  return conexao;
}

export async function getAllPosts() {
  const conexao = await obterConexao();
  const db = conexao.db("imersao-alura")
  const colecao = db.collection("posts")
  return colecao.find().toArray()
}

export async function buscarPostPorID(id) {
  const conexao = await obterConexao();
  const db = conexao.db("imersao-alura");
  const colecao = db.collection("posts");
    try {
    return await colecao.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Erro ao buscar o post por ID:", error);
    return null;
  }
}

export async function criarPost(novoPost) {
  const conexao = await obterConexao();
  const db = conexao.db("imersao-alura");
  const colecao = db.collection("posts");
  return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
  const conexao = await obterConexao();
  const db = conexao.db("imersao-alura");
  const colecao = db.collection("posts");
   // Conversão do ID para ObjectId
  // const objId = new ObjectId(id);
  const objId = ObjectId.createFromHexString(id);
  return colecao.updateOne({_id: new ObjectId(objId)}, {$set: novoPost})
}