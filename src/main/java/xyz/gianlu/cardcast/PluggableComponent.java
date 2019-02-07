package xyz.gianlu.cardcast;

import com.gianlu.pluggableserver.api.BaseComponent;
import io.undertow.server.HttpHandler;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.util.Map;

/**
 * @author Gianlu
 */
@SuppressWarnings("unused")
public class PluggableComponent extends BaseComponent {
    private final Main main;

    public PluggableComponent(@NotNull Map<String, String> config, @NotNull String appId) {
        super(config, appId);

        main = new Main(new File(config.get("webContent")));
    }

    @NotNull
    @Override
    public HttpHandler getHandler() {
        return main.getHandler();
    }

    @Override
    public @NotNull String id() {
        return "CardcastExport";
    }

    @Override
    protected void startImpl() {
    }

    @Override
    protected void stopImpl() {
    }
}
