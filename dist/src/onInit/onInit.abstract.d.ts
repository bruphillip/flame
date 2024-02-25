export declare abstract class OnInit {
    abstract onInit(): Promise<void>;
}
export declare function hasOnInit(module: unknown): module is OnInit;
