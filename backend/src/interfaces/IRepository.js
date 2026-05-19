/**
 * IRepository - Generic Repository Interface
 * Defines the contract for all repository implementations
 */
class IRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findOne(filter) { throw new Error('Not implemented'); }
  async findAll(filter, options) { throw new Error('Not implemented'); }
  async create(data) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  async count(filter) { throw new Error('Not implemented'); }
}

module.exports = IRepository;
