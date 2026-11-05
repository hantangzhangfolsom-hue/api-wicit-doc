package org.opensac.wicitapi.product;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Provides shopping guide rules for food categories.
 */
@RestController
@RequestMapping("/api/shopping-guide")
@Tag(name = "Shopping guide")
public class ShoppingGuideController {

    private final ShoppingGuideService shoppingGuideService;

    public ShoppingGuideController(ShoppingGuideService shoppingGuideService) {
        this.shoppingGuideService = shoppingGuideService;
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get shopping guide rules for a food category")
    public ResponseEntity<ShoppingGuideResponse> findBySlug(
            @PathVariable("slug") String slug
    ) {
        return ResponseEntity.of(shoppingGuideService.findBySlug(slug));
    }
}