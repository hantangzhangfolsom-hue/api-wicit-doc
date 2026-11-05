package org.opensac.wicitapi.product;

import java.util.List;

/**
 * Shopping guide rules for one food category.
 */
public record ShoppingGuideResponse(
        String slug,
        String name,
        String sourceUrl,
        String sourceLastUpdated,
        CanBuy canBuy,
        ConditionalPurchases conditionalPurchases,
        List<String> cannotBuy,
        HelpfulHints helpfulHints,
        List<GuideImage> images,
        List<Brand> brands
) {
    public record CanBuy(
            String description,
            List<String> items
    ) {}

    public record ConditionalPurchases(
            String condition,
            List<String> items
    ) {}

    public record HelpfulHints(
            String description,
            List<String> items,
            String note
    ) {}

    public record GuideImage(
            String url,
            String alt
    ) {}

    public record Brand(
            String name,
            String logoUrl
    ) {}
}