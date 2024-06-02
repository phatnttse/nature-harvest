package com.api.nature_harvest_backend.services.category;

import com.api.nature_harvest_backend.dtos.CategoryDto;
import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.repositories.CategoryRepository;
import com.api.nature_harvest_backend.repositories.ProductRepository;
import com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse;
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

    @Override
    @Transactional
    public Category createCategory(CategoryDto categoryDto) {
        Category newCategory = Category
                .builder()
                .name(categoryDto.getName())
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
        return categoryRepository.findAll();
    }

    @Override
    public List<CategoryProductCountResponse> getCategoryProductCounts() {
        return categoryRepository.findCategoryProductCounts();
    }

    @Override
    @Transactional
    public Category updateCategory(long categoryId,
                                   CategoryDto categoryDto) {
        Category existingCategory = getCategoryById(categoryId);
        existingCategory.setName(categoryDto.getName());
        categoryRepository.save(existingCategory);
        return existingCategory;
    }

    @Override
    @Transactional
    public Category deleteCategory(long id) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());

        List<Product> products = productRepository.findByCategory(category);
        if (!products.isEmpty()) {
            throw new IllegalStateException("Cannot delete category with associated products");
        } else {
            categoryRepository.deleteById(id);
            return category;
        }
    }
}
