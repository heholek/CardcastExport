package xyz.gianlu.cardcast;

import io.undertow.Undertow;
import io.undertow.predicate.Predicate;
import io.undertow.server.HttpHandler;
import io.undertow.server.HttpServerExchange;
import io.undertow.server.RoutingHandler;
import io.undertow.server.handlers.resource.FileResourceManager;
import io.undertow.server.handlers.resource.ResourceHandler;
import org.jetbrains.annotations.NotNull;

import java.io.File;


/**
 * @author Gianlu
 */
public class Main {
    private final RoutingHandler handler;

    public Main(@NotNull File webContent) {
        ResourceHandler resourceHandler = new ResourceHandler(new FileResourceManager(webContent));

        handler = new RoutingHandler();
        handler.setFallbackHandler(resourceHandler);
        handler.get("/code/{id}/", exchange -> {
            exchange.setRelativePath("/code.html");
            resourceHandler.handleRequest(exchange);
        });
    }

    public static void main(String[] args) {
        Main main = new Main(args.length == 0 ? new File("./WebContent") : new File(args[0]));

        Undertow.builder().setHandler(main.getHandler())
                .addHttpListener(8080, "0.0.0.0")
                .build().start();
    }

    @NotNull
    public HttpHandler getHandler() {
        return handler;
    }
}
