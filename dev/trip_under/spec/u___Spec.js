describe("___.each", function() {

	it('should call fn for each element', function(){
		var fn = jasmine.createSpy('eachCallback');

		___(['JS', 'Oxford']).each(fn);

		expect(fn.calls.count()).toBe(2);
	});

	it('should give the values of the array', function(){
		var fn = jasmine.createSpy('eachCallback')

		___(['JS', 'Oxford']).each(fn);

		expect(fn).toHaveBeenCalledWith('JS');
		expect(fn).toHaveBeenCalledWith('Oxford');
	});

});


describe("___.map", function() {

	it('should call fn with each element', function(){
		var fn = jasmine.createSpy('eachCallback');

		___([42, 100]).map(fn);

		expect(fn.calls.count()).toBe(2);

		expect(fn).toHaveBeenCalledWith(42);
		expect(fn).toHaveBeenCalledWith(100);
	});

	it('should return the results', function(){
		var fn = jasmine.createSpy('eachCallback').and.callReturn(42);

		var result = ___(['what', 'ever']).map(fn);

		expect(result).toEqual([42,42]);
	});

});


describe("___.any", function() {

	it('should deal with an item matching', function(){

		var match = ___([100, 500, 1689]).any(function(i){
			return i === 500;
		});

		expect(match).toBe(true);
	});

	it('should deal with no items matching', function(){

		var match = ___([100, 500, 1689]).any(function(i){
			return i === 101;
		});

		expect(match).toBe(false);
	});
	
});



describe("___.contains", function() {

	it('should deal with an item matching', function(){

		var match = ___([100, 500, 1689]).contains(500);

		expect(match).toBe(true);
	});

	it('should deal with no items matching', function(){

		var match = ___([100, 500, 1689]).contains(101);

		expect(match).toBe(false);
	});

	it("won't false positive on undefined", function(){

		var match = ___([null, NaN, false]).contains(undefined);

		expect(match).toBe(false);
	});
	
});


describe("___.first", function() {

	it('gives the first item', function(){

		var match = ___(['JS', 'Oxford']).first();

		expect(match).toBe('JS');
	});
	
});


describe("stress", function(){
	it("can map big arrays", function(){
		//5999999
		var out = ___(new Array(8000)).map(function(){
			var c = document.createElement('canvas')
			c.height = 10; c.width = 10; c.style.display = 'inline-block';
			document.body.appendChild(c)
			var ctx = c.getContext('2d');
			ctx.fillStyle="#08f";
			ctx.shadowBlur=2;
			ctx.shadowColor="black";
			ctx.fillRect(0,0,5,5);
			return Math.random();
		})
		var el;
		while(el = document.getElementsByTagName('canvas')[0]){el.remove()}

		expect(true).toBe(true)
	})
})