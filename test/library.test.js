const Biblioteca = require("../src/library")
const crypto = require('crypto');

/**
 * Objeto Livro
 * * id: string (uuid)
 * * titulo: string
 * * autor: string
 * * emprestado: Boolean
 * * genero: Array<string>
 * * ano: number
 * * idMembro: string (uuid) | undefined
 */
const book = {
    id: crypto.randomUUID(),
    titulo: "O Alquimista",
    autor: "Paulo Coelho",
    genero: ["Romance", "Drama"],
    ano: 1988,
    emprestado: false,
    idMembro: undefined
}

const registeredBooks = [{
    id: crypto.randomUUID(),
    titulo: "O Teologista",
    autor: "Paulo Coelho",
    genero: ["Drama"],
    ano: 1995,
    emprestado: false,
    idMembro: undefined
}, {
    id: crypto.randomUUID(),
    titulo: "O Filósofo",
    autor: "Paulo Coelho",
    genero: ["Drama"],
    ano: 1995,
    emprestado: false,
    idMembro: undefined
}]

/**
 * Objeto Membro
 * * id: string (uuid)
 * * nome: string
 */
const member = {
    id: crypto.randomUUID(),
    nome: "Yuri"
}

const registeredMembers = [{
    id: crypto.randomUUID(),
    nome: "Roberto"
}]

const handleLoanBook = (lib) => {
    lib.adicionarLivro(book)
    lib.adicionarMembro(member)

    lib.emprestarLivro(book.id, member.id)
}

// Suíte de testes relacionados ao livro
describe("Book operations", () => {

    // Gera uma nova instância vazia da Biblioteca antes de cada teste
    beforeEach(() => {
        lib = new Biblioteca();

        // Adiciona alguns outros livros para melhorar a realidade do teste
        registeredBooks.map(book => lib.adicionarLivro(book))
    });

    // Deve adicionar um novo livro
    it("should add a new book", () => {
        lib.adicionarLivro(book)

        const booksInLibrary = lib.listarLivros()

        const testBooks = [...registeredBooks, book] 

        expect(booksInLibrary).toStrictEqual(testBooks)
    })

    // Deve remover um livro
    it("should remove a book", () => {
        lib.adicionarLivro(book)
        lib.removerLivro(book.id)

        const books = lib.listarLivros()

        expect(books).toEqual(registeredBooks)
    })

    // Deve buscar um livro utilizando seu id
    it("should search a book by id", () => {
        lib.adicionarLivro(book)
        
        const bookFound = lib.buscarLivroPorId(book.id)

        expect(bookFound).toEqual(book)
    })

    // Deve buscar um livro utilizando seu título
    it("should search a book by title", () => {
        lib.adicionarLivro(book)
        const bookFound = lib.buscarLivroPorTitulo(book.titulo)

        expect(bookFound).toEqual([book])
    })

    // Deve listar os livros
    it("should list the books", () => {
        const books = lib.listarLivros()

        expect(books).toEqual(registeredBooks)
    })

    // Deve listar os livros por autor
    it("should list the books by author", () => {
        lib.adicionarLivro(book)
        const booksByAuthor = lib.listarLivrosPorAutor("Paulo Coelho")

        expect(booksByAuthor).toEqual([...registeredBooks, book])
    })

    // Deve listar os livros por gênero
    it("should list the books by genre", () => {
        lib.adicionarLivro(book)
        const booksByGenre = lib.listarLivrosPorGenero("Romance")

        expect(booksByGenre).toEqual([book])
    })

    // Deve atualizar as informações de um livro
    it("should update book info", () => {
        lib.adicionarLivro(book)

        const updatedBook = {
            ...book,
            titulo: "O Alquimista de Pedra"
        }

        lib.atualizarInformacaoLivro(book.id, updatedBook)

        const searchedBook = lib.buscarLivroPorId(book.id)

        expect(searchedBook).toEqual(updatedBook)
        expect(searchedBook.titulo).toBe("O Alquimista de Pedra")
    })

    // Não deve atualizar as informações caso o livro não exista
    it("should not updated book info if book do not exist", () => {
        lib.atualizarInformacaoLivro(crypto.randomUUID, {
            titulo: "teste"
        })

        const books = lib.listarLivros()

        expect(books).toEqual(registeredBooks)
    })

    // Deve listar os livros por ano
    it("should list books by year", () => {
        const books = lib.listarLivrosPorAno(1995)

        expect(books).toEqual(registeredBooks)
    })
})

// Suíte de testes relacionados ao membro
describe("Member operations", () => {

    // Gera uma nova instância vazia da Biblioteca antes de cada teste
    beforeEach(() => {
        lib = new Biblioteca();

        // Adiciona uma base de membros
        registeredMembers.map(member => lib.adicionarMembro(member))
    });

    // Deve adicionar um novo membro
    it("should add a new member", () => {
        lib.adicionarMembro(member)

        const testMembers = [...registeredMembers, member]
        const members = lib.listarMembros()

        expect(testMembers).toStrictEqual(members)
    })

    // Deve remover um membro
    it("should remove a member", () => {
        lib.adicionarMembro(member)
        lib.removerMembro(member.id)

        const members = lib.listarMembros()

        expect(members).toStrictEqual(registeredMembers)
    })

    // Deve buscar membro por id
    it("should search a member by id", () => {
        lib.adicionarMembro(member)
        
        const memberFound = lib.buscarMembroPorId(member.id)

        expect(memberFound).toStrictEqual(member)
    })

    // Deve listar os membros
    it("should list members", () => {
        const members = lib.listarMembros()

        expect(members).toStrictEqual(registeredMembers)
    })
})

// Suíte de testes relacionados ao empréstimo
describe("Loan operations", () => {

    // Gera uma nova instância vazia da Biblioteca antes de cada teste
    beforeEach(() => {
        lib = new Biblioteca();

        // Adiciona alguns outros livros para melhorar a realidade do teste
        registeredBooks.map(book => lib.adicionarLivro(book))

        // Adiciona uma base de membros
        registeredMembers.map(member => lib.adicionarMembro(member))
    });

    // Deve emprestar um livro
    it("should loan an book", () => {
        lib.adicionarLivro(book)
        lib.adicionarMembro(member)

        const isBorrowed = lib.emprestarLivro(book.id, member.id)
        expect(isBorrowed).toBe(true)

        const isBorrowedTwice = lib.emprestarLivro(book.id, member.id)
        expect(isBorrowedTwice).toBe(false)
    })
    
    // Deve devolver um livro
    it("should return the book", () => {
        handleLoanBook(lib)

        const isReturned = lib.devolverLivro(book.id)
        expect(isReturned).toBe(true)

        const isReturnedTwice = lib.devolverLivro(book.id)
        expect(isReturnedTwice).toBe(false)
    })

    // Deve listar os livros emprestados
    it("should list the borrowed books", () => {
        handleLoanBook(lib)

        const borrowedBooks = lib.listarLivrosEmprestados()

        expect(borrowedBooks).toStrictEqual([book])
    })

    // Deve listar os livros disponíveis
    it("should return the available books", () => {
        handleLoanBook(lib)
        
        const availableBooks = lib.listarLivrosDisponiveis()

        expect(availableBooks).toStrictEqual(registeredBooks)
    })
})

describe("Count methods", () => {
    // Gera uma nova instância vazia da Biblioteca antes de cada teste
    beforeEach(() => {
        lib = new Biblioteca();

        // Adiciona alguns outros livros para melhorar a realidade do teste
        registeredBooks.map(book => lib.adicionarLivro(book))

        // Adiciona uma base de membros
        registeredMembers.map(member => lib.adicionarMembro(member))
    });

    // deve contar os livros
    it("should count the books", () => {
        count = lib.contarLivros()
        expect(count).toBe(2)
    })

    // deve contar os membros
    it("should count the members", () => {
        count = lib.contarMembros()
        expect(count).toBe(1)
    })
})