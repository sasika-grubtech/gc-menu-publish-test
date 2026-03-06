/**
 * Scenario Test Builder
 * 
 * This builder dynamically generates Cypress test specs from scenario configurations.
 * It orchestrates the test lifecycle: setup → actions → verifications → cleanup.
 */

import { ProductMiddleLayer } from "cypress/page-objects/middle-layer/product-middle-layer";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { Cleanup } from "cypress/page-objects/middle-layer/cleanup";
import { AuthenticationService } from "cypress/scripts/authenticationService";
import { MenuPublishLayer } from "cypress/page-objects/middle-layer/menu-publish-layer";
import { GC2MiddleLayer } from "cypress/page-objects/middle-layer/gc2-middle-layer";
import { GC2CleanupMethods } from "cypress/page-objects/pages/cleanup/gc2_cleanup_method";
import { Sample } from "cypress/page-objects/middle-layer/sample";
import { ModifierGroupMiddleLayer } from "cypress/page-objects/middle-layer/modifier-group-middle-layer";
import { TestScenarioConfig, TestAction, TestVerification } from "../test-config/test-scenarios.config";
import { MenuHomePage } from "cypress/page-objects/pages/menu/menu-home-page";
import { MenuPage } from "cypress/page-objects/pages/menu/menu-page";

export class ScenarioTestBuilder {
  private modifierGroupMiddleLayer: ModifierGroupMiddleLayer;
  private sample: Sample;
  private productMiddleLayer: ProductMiddleLayer;
  private navigator: PageNavigator;
  private cleanup: Cleanup;
  private menuPublishLayer: MenuPublishLayer;
  private gc2MiddleLayer: GC2MiddleLayer;
  private gc2CleanupMethods: GC2CleanupMethods;
  private menuHome: MenuHomePage;
  private menuPage: MenuPage;

  constructor() {
    this.modifierGroupMiddleLayer = new ModifierGroupMiddleLayer();
    this.sample = new Sample();
    this.productMiddleLayer = new ProductMiddleLayer();
    this.navigator = new PageNavigator();
    this.cleanup = new Cleanup();
    this.menuPublishLayer = new MenuPublishLayer();
    this.gc2MiddleLayer = new GC2MiddleLayer();
    this.gc2CleanupMethods = new GC2CleanupMethods();
    this.menuHome = new MenuHomePage();
    this.menuPage = new MenuPage();
  }

  /**
   * Build a complete Cypress test suite from a scenario configuration
   */
  public buildTest(scenario: TestScenarioConfig): void {
    describe(scenario.name, () => {
      
      // Add scenario description
      before(() => {
        cy.log('═══════════════════════════════════════════════════════════════');
        cy.log(`📋 SCENARIO: ${scenario.name}`);
        cy.log(`📝 DESCRIPTION: ${scenario.description}`);
        cy.log('═══════════════════════════════════════════════════════════════');
      });

      // Setup phase
      this.buildSetupTests(scenario);

      // Actions phase
      this.buildActionTests(scenario);

      // Verifications phase
      this.buildVerificationTests(scenario);

      // Cleanup phase
      this.buildCleanupTest(scenario);
    });
  }

  /**
   * Build setup phase tests (create products, modifier groups, menus)
   */
  private buildSetupTests(scenario: TestScenarioConfig): void {
    const { setup } = scenario;

    if (setup.products > 0) {
      it(`Should create ${setup.products} product(s)`, () => {
        this.navigator.navigate_to_product_page();
        this.productMiddleLayer.product_create_with_mandatory_fields(setup.products);
      });
    }

    if (setup.modifierGroups > 0) {
      it(`Should create ${setup.modifierGroups} modifier group(s)`, () => {
        this.navigator.navigate_to_modifier_group_page();
        this.modifierGroupMiddleLayer.modifier_group_bulk_create(setup.modifierGroups);
      });
    }

    if (setup.nestedModifierChain) {
      const { chainIndex, productCount, modifierGroupCount } = setup.nestedModifierChain;
      it(`Should build nested modifier chain(s)`, () => {
        this.modifierGroupMiddleLayer.modifier_group_bulk_edit(
          chainIndex,
          productCount,
          modifierGroupCount
        );
      });
    }

    if (setup.menu) {
      const { count, categoriesPerMenu, productsPerCategory, reuseProducts } = setup.menu;
      const reuseText = reuseProducts ? ' (reusing products)' : '';
      it(`Should create ${count} menu(s) with ${categoriesPerMenu} categories and ${productsPerCategory} products per category${reuseText}`, () => {
        this.navigator.navigate_to_menu_page();
        this.sample.logic(count, categoriesPerMenu, productsPerCategory, reuseProducts);
      });
    }
  }

  /**
   * Build action phase tests (publish, override, etc.)
   */
  private buildActionTests(scenario: TestScenarioConfig): void {
    const { actions } = scenario;
    let publishCount = 0;

    actions.forEach((action, index) => {
      switch (action.type) {
        case 'publish':
          publishCount++;
          it(`Should publish the menu${publishCount > 1 ? ` (publish #${publishCount})` : ''}`, () => {
            this.menuPublishLayer.menu_publish();
          });
          break;

        case 'override_product_price':
          it(`Should override product price: ${action.productDisplayName} → ${action.newPrice} in category ${action.categoryIndex + 1}`, () => {
            cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
              const menuName = data.menuNames[0];
              const menuTimestamp = menuName.split('_').pop();
              const categoryName = `M1_Category ${action.categoryIndex + 1}_${menuTimestamp}`;

              this.navigator.navigate_to_menu_page();
              cy.wait(2000);
              this.menuHome.step_search_menu(menuName);
              this.menuHome.step_click_edit_menu();
              cy.wait(2000);
              this.menuPage.step_click_category_products_tab();
              cy.wait(2000);
              this.menuPage.step_edit_product_price_in_category(
                categoryName,
                action.productDisplayName,
                action.newPrice
              );
              this.menuPage.step_click_update_menu_button();
              this.menuHome.verify_toast_message('Menu updated successfully');
            });
          });
          break;

        case 'revert_product_price':
          it(`Should revert product price: ${action.productDisplayName} → ${action.originalPrice} in category ${action.categoryIndex + 1}`, () => {
            cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
              const menuName = data.menuNames[0];
              const menuTimestamp = menuName.split('_').pop();
              const categoryName = `M1_Category ${action.categoryIndex + 1}_${menuTimestamp}`;

              this.navigator.navigate_to_menu_page();
              cy.wait(2000);
              this.menuHome.step_search_menu(menuName);
              this.menuHome.step_click_edit_menu();
              cy.wait(2000);
              this.menuPage.step_click_category_products_tab();
              cy.wait(2000);
              this.menuPage.step_edit_product_price_in_category(
                categoryName,
                action.productDisplayName,
                action.originalPrice
              );
              this.menuPage.step_click_update_menu_button();
              this.menuHome.verify_toast_message('Menu updated successfully');
            });
          });
          break;

        // Add more action handlers as needed
        default:
          cy.log(`⚠️ Action type "${(action as any).type}" not yet implemented`);
      }
    });
  }

  /**
   * Build verification phase tests (check GC2 state)
   */
  private buildVerificationTests(scenario: TestScenarioConfig): void {
    const { verifications } = scenario;

    // Group verifications by publish action
    // For now, run all verifications after the last publish
    if (verifications.length > 0) {
      it('Should verify all expected outcomes in GC2', () => {
        verifications.forEach(verification => {
          this.executeVerification(verification);
        });
      });
    }
  }

  /**
   * Execute a single verification
   */
  private executeVerification(verification: TestVerification): void {
    switch (verification.type) {
      case 'gc2_menu_exists':
        cy.log('🔍 Verifying menu exists in GC2...');
        this.gc2MiddleLayer.gc2_menus_page();
        break;

      case 'gc2_menu_items_count':
        cy.log(`🔍 Verifying ${verification.expectedCount} menu items in GC2...`);
        this.navigator.navigate_to_gc2_menu_items_page();
        this.gc2MiddleLayer.gc2_menu_items_table_verification(verification.expectedCount);
        break;

      case 'gc2_product_count_by_name':
        cy.log(`🔍 Verifying product "${verification.displayName}" appears ${verification.expectedCount} time(s)...`);
        this.gc2MiddleLayer.gc2_verify_menu_item_count_for_name(
          verification.displayName,
          verification.expectedCount
        );
        break;

      case 'gc2_product_with_different_prices':
        cy.log(`🔍 Verifying product "${verification.displayName}" with prices ${verification.price1} and ${verification.price2}...`);
        this.gc2MiddleLayer.gc2_verify_two_menu_items_same_name_different_prices(
          verification.displayName,
          verification.price1,
          verification.price2
        );
        break;

      case 'gc2_modifier_groups_count':
        cy.log(`🔍 Verifying ${verification.expectedCount} modifier group(s) in GC2...`);
        this.gc2MiddleLayer.gc2_modifier_groups_page_verify(verification.expectedCount);
        break;

      case 'gc2_modifier_group_not_exists':
        cy.log(`🔍 Verifying modifier group "${verification.displayName}" does NOT exist...`);
        this.gc2MiddleLayer.gc2_verify_modifier_group_not_exists(verification.displayName);
        break;

      case 'gc2_menu_per_location':
        cy.log(`🔍 Verifying menu appears ${verification.expectedLocationCount} time(s) (one per location)...`);
        this.gc2MiddleLayer.gc2_menus_page_verify_menu_per_location(
          verification.expectedLocationCount,
          {
            locations: verification.locations,
            brandName: verification.brandName,
          }
        );
        break;

      case 'gc2_product_reused_without_duplicate':
        cy.log(`🔍 Verifying product "${verification.displayName}" is reused (${verification.reason})...`);
        this.gc2MiddleLayer.gc2_verify_menu_item_count_for_name(
          verification.displayName,
          verification.expectedCount
        );
        break;

      case 'gc2_product_duplicated_with_override':
        cy.log(`🔍 Verifying product "${verification.displayName}" is duplicated with override (${verification.overriddenField})...`);
        this.gc2MiddleLayer.gc2_verify_menu_item_count_for_name(
          verification.displayName,
          verification.expectedCount
        );
        break;

      case 'custom_agent':
        // Support for custom verification agents
        cy.log(`🔍 Running custom agent: ${(verification as any).agent}`);
        const { VerificationAgents } = require('../verification-logic/verification-agents');
        const agentName = (verification as any).agent;
        const params = (verification as any).params;
        
        if (VerificationAgents[agentName]) {
          // Call the agent method with parameters
          if (typeof params === 'object' && !Array.isArray(params)) {
            // Object params - extract values
            const paramValues = Object.values(params);
            VerificationAgents[agentName](...paramValues);
          } else {
            // Direct params
            VerificationAgents[agentName](params);
          }
        } else {
          cy.log(`⚠️ Agent "${agentName}" not found`);
        }
        break;

      default:
        cy.log(`⚠️ Verification type "${(verification as any).type}" not yet implemented`);
    }
  }

  /**
   * Build cleanup phase test
   */
  private buildCleanupTest(scenario: TestScenarioConfig): void {
    after('Should cleanup all created entities', () => {
      AuthenticationService.authenticate();
      
      const { cleanup } = scenario;
      
      if (cleanup.menus > 0) {
        this.cleanup.cleanup_menu(cleanup.menus);
      }
      
      if (cleanup.products > 0) {
        this.cleanup.cleanup_product(cleanup.products);
      }
      
      if (cleanup.modifierGroups > 0) {
        this.cleanup.cleanup_modifier_group(cleanup.modifierGroups);
      }
      
      if (cleanup.gc2MenuItems > 0) {
        this.gc2CleanupMethods.cleanup_menu_item(cleanup.gc2MenuItems);
      }
      
      if (cleanup.gc2Menus > 0) {
        this.gc2CleanupMethods.cleanup_menu(cleanup.gc2Menus);
      }
      
      if (cleanup.gc2ModifierGroups > 0) {
        this.gc2CleanupMethods.cleanup_modifier_group(cleanup.gc2ModifierGroups);
      }
      
      this.cleanup.cleanup_hierarchy_mapping_clearance();
    });
  }
}

/**
 * Helper function to quickly create a test from a scenario
 */
export function createTestFromScenario(scenario: TestScenarioConfig): void {
  const builder = new ScenarioTestBuilder();
  builder.buildTest(scenario);
}
