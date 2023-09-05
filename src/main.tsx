import { VNode } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { render } from 'preact-render-to-string';
import prepass from 'preact-ssr-prepass';

function LazyComponent(): VNode {
    return <div>Hello, World!</div>;
}

const Comp = lazy(async () => LazyComponent);

function LazyComponent2(): VNode {
    const Comp2 = lazy(async () => {
        return () => <span>Hello, World!</span>;
    });

    return <Comp2 />;
}

function ParameterizedLazyComponent({ id }: { id: number }): VNode {
    const Comp3 = lazy(async () => {
        const name = await getNameById(id);
        return () => <div>Hello, {name}!</div>;
    });

    return <Comp3 />;
}

(async () => {
    const tree = <html>
        <body>
            <Suspense fallback={undefined}>
                {/* Works */}
                <Comp />

                {/* Triggers error */}
                {/* <LazyComponent2 /> */}

                {/* Triggers error */}
                {/* <ParameterizedLazyComponent id={1} /> */}
            </Suspense>
        </body>
    </html>;

    await prepass(tree);

    try {
        console.log(render(tree));
    } catch (err) {
        console.error('Threw', err);
        throw err;
    }
})();

async function getNameById(id: number): Promise<string> {
    await new Promise<void>((resolve) => {
        setTimeout(resolve, 100);
    });

    return `Name #${id}`;
}
