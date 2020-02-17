function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function () {
  return new Promise((resolve, reject) => {
    setTimeout(()=> resolve(this.foods), 2000);
  });
}

describe('mocking learning', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn();
    fetchDogs();
    expect(fetchDogs).toHaveBeenCalled();
    // expect(fetchDogs).toHaveBeenCalledWith('snickers');
    console.log(fetchDogs);
  });

  it('can create a person', () => {
    const me = new Person('claire', ['oden','konbu']);
    expect(me.name).toBe('claire');
  });

  it('can fetch foods', async () => {
    const me = new Person('claire');
    // mock the favFoods functions
    me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi','ramen']);
    const favFoods = await me.fetchFavFoods();
    expect(favFoods).toContain('ramen');
  });
});
