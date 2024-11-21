import express from "express";

const posts = [
  {
      id: "1",
      descricao: "Uma foto teste",
      imagem: "https://placecats.com/millie/300/150"
  },
  {
      id: "2",
      descricao: "Gato fofo dormindo",
      imagem: "https://placekitten.com/400/200"
  },
  {
      id: "3",
      descricao: "Paisagem montanhosa",
      imagem: "https://picsum.photos/seed/picsum/600/400"
  },
  {
      id: "4",
      descricao: "Cachorro brincando",
      imagem: "https://placeimg.com/640/480/animals"
  },
  {
      id: "5",
      descricao: "Comida deliciosa",
      imagem: "https://loremflickr.com/640/480/food"
  },
  {
      id: "6",
      descricao: "Cidade à noite",
      imagem: "https://source.unsplash.com/random/600x400/?city,night"
  }
];
const app = express();
app.use(express.json())

app.listen(3000, () => {
  console.log("Servidor escutando!");
});

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

function buscarPostPorId(id) {
  return posts.findIndex((post) =>{
    return post.id == Number(id)
  })
}

app.get("/posts/:id", (req, res) => {
  const index = buscarPostPorId(req.params.id)
  res.status(200).json(posts[index]);
});
