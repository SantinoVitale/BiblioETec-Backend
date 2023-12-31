import { booksManagerService } from "../service/booksManager.service.js"
import { bookManagerLogger } from "../utils/log4js.js"
import { userService } from "../service/user.service.js"

class BooksManagerController{
  async get(req, res){
    const booksCard = await booksManagerService.get()
    bookManagerLogger.info(`Se trajeron ${booksCard.length} tarjetas de los libros correctamente`);
    return res.status(200).json({
      status: "success",
      message: "Libros extraidos de la base de datos correctamente",
      valid: true,
      payload: {booksCard}
    })
  }

  async getById(req, res){
    const {bid} = req.params
    if(!bid)
    {
      bookLogger.error("No se pasó el bid")
      return res.status(400).json({
        status: "error",
        message: "No se pasó el bid",
        valid: false
      })
    }
    const bookCard = await booksManagerService.getById(bid)

    if (!bookCard)
    {
      bookManagerLogger.error(`Hubo un error al encontrar el libro con el ID ${bid}. Error: ${bookCard}`)
      return res.status(400).json({
        status: "error",
        message: "No se ha podido traer la carta del libro correctamente",
        valid: false
      })
    }
    
    bookManagerLogger.info(`Se encontró el libro con el ID ${bid}. Libro: ${bookCard}`);
    return res.status(200).json({
      status: "success",
      message: "Carta del libro extraido de la base de datos correctamente",
      valid: true,
      payload: {bookCard}
    })
  }

  async post(req, res){
    const {user, books} = req.body;
    const fechaActual = new Date();
    const fechaArg = new Date(fechaActual.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
    const unaSemana = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
    const fechaMasUnaSemana = new Date(fechaArg.getTime() + unaSemana);

    if (!user || !books)
    {
      bookManagerLogger.error(`Faltó alguno de los 2 campos. Campo user: ${user}, books: ${books}`);
      return res.status(400).json({
        status: "error",
        message: "No se pudo subir el libro debido a que faltan datos",
        valid: false
      })
    }

    await booksManagerService.post(fechaArg, fechaMasUnaSemana, books, user)
    .then(async (data) => {
      const userPostCard = await userService.postBook(user, data._id);
      if(!data || !userPostCard)
      {
        bookManagerLogger.error(`No se pudo subir el cardBook. Error: ${data}`);
        return res.status(400).json({
          status: "error",
          message: "No se pudo subir el libro",
          valid: false
        })
      }
  
      bookManagerLogger.info(`Se subio el cardBook con el ID ${data._id} con el libro ${data.books}`)
      return res.status(200).json({
        status: "success",
        message: "Se subio el libro correctamente",
        valid: true,
        payload: {data}
      })
    })

  }

  async put(req, res){

  }

  async delete(req, res){
    const {bid} = req.params
    const {id} = req.body;

    if(!bid)
    {
      bookManagerLogger.error("No se pasó el bid")
      return res.status(400).json({
        status: "error",
        message: "No se pasó el bid",
        valid: false
      })
    }
    const deleteBookCard = await booksManagerService.delete(bid, id)
    if (!deleteBookCard)
    {
      bookManagerLogger.error(`No se pudo borrar el bookCard con el ID ${bid}. Error: ${deleteBookCard}`)
      return res.status(400).json({
        status: "error",
        message: "No se ha podido borrar la carta del libro correctamente",
        valid: false
      })
    }
    bookManagerLogger.info(`Se borró el bookCard con el ID ${bid} correctamente`)
    return res.status(200).json({
      status: "success",
      message: "Carta del libro borrado de la base de datos correctamente",
      payload: {deleteBookCard},
      valid: true
    })
  }

  async getByUser(req, res){
    const {uid} = req.params
    if(!uid)
    {
      bookLogger.error("No se pasó el uid")
      return res.status(400).json({
        status: "error",
        message: "No se pasó el uid",
        valid: false
      })
    }
    const bookCard = await booksManagerService.getByUser(uid)
    if (!bookCard)
    {
      bookManagerLogger.error(`Hubo un error al encontrar el usuario con el ID ${uid}. Error: ${bookCard}`)
      return res.status(400).json({
        status: "error",
        message: "No se ha podido traer la carta del libro correctamente",
        valid: false
      })
    }
    
    bookManagerLogger.info(`Se encontró el libro con el ID ${uid}.`);
    return res.status(200).json({
      status: "success",
      message: "Carta del libro extraido de la base de datos correctamente",
      valid: true,
      payload: {bookCard}
    })
  }
}

export const booksManagerController = new BooksManagerController()