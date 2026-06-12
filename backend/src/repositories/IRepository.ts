export default interface IRepository<T> {
    findAll(): Promise<T[]>
    findById(id: string): Promise<T | null>
    findOne(entity: Partial<T>): Promise<T | null>
    create(entity: T): Promise<T>
    update(id: string, entity: Partial<T>): Promise<T | null>
    delete(id:string): Promise<void> 
}