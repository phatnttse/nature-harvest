package com.api.nature_harvest_backend.services.category;

import com.api.nature_harvest_backend.dtos.category.CategoryDto;
import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.models.SubCategory;
import com.api.nature_harvest_backend.repositories.CategoryRepository;
import com.api.nature_harvest_backend.repositories.ProductRepository;
import com.api.nature_harvest_backend.repositories.SubCategoryRepository;
import com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse;
import com.api.nature_harvest_backend.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Override
    @Transactional
    public Category createCategory(CategoryDto categoryDto) {
        Category newCategory = Category
                .builder()
                .name(categoryDto.getName())
                .slug(StringUtils.toSlug(categoryDto.getName()))
                .thumbnail(categoryDto.getThumbnail())
                .active(true)
                .build();
        return categoryRepository.save(newCategory);
    }

    @Override
    public Category getCategoryById(long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAllActive();
    }

    @Override
    public List<CategoryProductCountResponse> getCategoryProductCounts() {
        return categoryRepository.findCategoryProductCounts();
    }

    @Override
    @Transactional
    public void updateCategory(long categoryId,
                               CategoryDto categoryDto) {
        Category existingCategory = getCategoryById(categoryId);
        existingCategory.setName(categoryDto.getName());
        existingCategory.setSlug(StringUtils.toSlug(categoryDto.getName()));
        existingCategory.setThumbnail(categoryDto.getThumbnail());
        categoryRepository.save(existingCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(long id) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(ChangeSetPersister.NotFoundException::new);
        category.setActive(false);
        categoryRepository.save(category);
        // Update related products
        List<Product> products = productRepository.findByCategory(category);
        products.forEach(product -> product.setActive(false));
        productRepository.saveAll(products);

        List<SubCategory> subCategories = subCategoryRepository.findByCategoryAndActive(category, false);
        subCategories.forEach(subCategory -> subCategory.setActive(false));
        subCategoryRepository.saveAll(subCategories);
    }
}
