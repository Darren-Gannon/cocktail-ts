import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Module, Service } from '../src';

let TestModule: Module;

let AppModule: Module;

class MyService implements Service {

    constructor(
        private testService: TestService
    ) {}

    async onInit(): Promise<void> { }
    
    async onDestroy(): Promise<void> { }

    sayHello(){
        return `hello ${this.testService.getName()}`
    }
}

class TestService implements Service {
    
    async onInit(): Promise<void> { }
    
    async onDestroy(): Promise<void> { }

    getName(): string {
        return 'test';
    }
}

chai.use(chaiAsPromised);

describe('End to End Test', () => {
    
    beforeEach(done => {
        TestModule = new Module({
            providers: {
                TestService: () => new TestService(),
            }
        });
        AppModule = new Module({
            providers: {
                MyService: m => new MyService(m.imports.TestModule.services.TestService as TestService)
            },
            imports: {
                TestModule: TestModule
            }
        });
        done();
    })

    describe('start test', () => {
        it('onInit', () => {
            return expect(AppModule.onInit()).to.eventually.be.fulfilled;
        })
    })

    describe('end test', () => {
        beforeEach(done => {
            AppModule.onInit().then(() => {done()});
        })
        it('onDestory', () => {
            return expect(AppModule.onDestroy()).to.eventually.be.fulfilled;
        })
    })

    describe('general test', () => {
        beforeEach(done => {
            AppModule.onInit().then(() => {done()});
        })
        afterEach(done => {
            AppModule.onDestroy().then(() => {done()});
        })
        it('run', () => {
            let service: MyService = AppModule.services.MyService as MyService;
            
            return expect(service.sayHello()).to.equal('hello test');
        })
    })
})