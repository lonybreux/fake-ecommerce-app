import type { ICliente, ICreateClienteDto } from "../models/cliente.model.js";
import type IRepository from "../repositories/IRepository.js";

export default class ClienteService {

    constructor(private repository: IRepository<ICliente>){}

    public async findAllClientes(): Promise<ICliente[]> {
        return await this.repository.findAll()
    }

    public async findClienteById(id: string): Promise<ICliente | null> {
        const cliente = await this.repository.findById(id)

        if(!cliente) throw new Error('El cliente no existe')
        
        return cliente
    }

    public async findOneClienteByEmail(email: string): Promise<ICliente | null> {
        const cliente = await this.repository.findOne({email})

        if(!cliente) throw new Error('El cliente no existe')
        
        return cliente
    }

    public async createCliente(cliente: ICreateClienteDto): Promise<ICliente> {
        const clienteExists = await this.repository.findOne({email: cliente.email})

        if(clienteExists) throw new Error('Este cliente ya existe')

        return await this.repository.create(cliente)
    }

    public async updateCliente(id: string, c: Partial<ICliente>): Promise<ICliente | null> {
        const cliente = await this.repository.findById(id)

        if(!cliente) throw new Error('El cliente no existe')
        
        return await this.repository.update(id,c)
    }

    public async deleteCliente(id: string): Promise<void> {
        await this.repository.delete(id)
    }
}