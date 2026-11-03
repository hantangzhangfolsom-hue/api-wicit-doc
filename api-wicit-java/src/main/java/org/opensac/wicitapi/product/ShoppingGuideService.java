package org.opensac.wicitapi.product;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.util.Optional;

/**
 * Reads food-category rules from the shopping guide JSON files.
 */
@Service
public class ShoppingGuideService {

    private final JsonMapper jsonMapper;

    public ShoppingGuideService(JsonMapper jsonMapper) {
        this.jsonMapper = jsonMapper;
    }

    public Optional<ShoppingGuideResponse> findBySlug(String slug) {
        if (slug == null || !slug.matches("[a-z0-9-]+")) {
            return Optional.empty();
        }

        var resource = new ClassPathResource(
                "shopping-guide/" + slug + ".json"
        );

        if (!resource.exists()) {
            return Optional.empty();
        }

        try (var input = resource.getInputStream()) {
            return Optional.of(
                    jsonMapper.readValue(input, ShoppingGuideResponse.class)
            );
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not read shopping guide: " + slug,
                    exception
            );
        }
    }
}