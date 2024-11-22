import fs from "fs";
import { getAllPosts, criarPost, buscarPostPorID, atualizarPost } from "../models/posts.model.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function getPosts(req, res) {
  const resultado = await getAllPosts();
  res.status(200).json(resultado);
}

export async function getPostById(req, res) {
  const { id } = req.params;
  try {
    const post = await buscarPostPorID(id);

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Erro ao buscar o post:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function criarNovoPost(req, res) {
  const novoPost = req.body;
  try {
    const resultado = await criarPost(novoPost);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar o post");
  }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

export async function atualizaNovoPost(req, res) {
  const id = req.params.id;

  // Construir o objeto post atualizado
  const urlImagem = `http://localhost:3000/${id}.png`;
  
  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);
    const postAtualizado = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt,
    };
    const resultado = await atualizarPost(id, postAtualizado);

    if (resultado.modifiedCount === 0) {
      return res.status(404).json({ error: "Post não encontrado ou já atualizado." });
    }

    res.status(200).json({ message: "Post atualizado com sucesso!", resultado });
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    res.status(500).json({ error: "Erro interno ao atualizar o post." });
  }
}